var ElasticLunr = require("elasticlunr");
var config = require('./config');

const LOCATIONS_TAB_IDENTIFIER="Locations";

// Module locals
var client = config.client()(LOCATIONS_TAB_IDENTIFIER);
var cachePromise = null;

const boosts = {
  "Name": {boost: 1},
  "Address": {boost: 0.5},
  "Service Names": {boost: 1},
  "Service Descriptions": {boost: 0.5},
  "Service Categories": {boost: 1},
  "Search": {boost: 3},
}

var elasticIndex = ElasticLunr(function() {
  Object.keys(boosts).forEach(this.addField.bind(this))
});

module.exports = {
  get: function(id) {
    if(cachePromise === null) this.refresh();
    return cachePromise.then(function(allLocations) {
      return allLocations.find(function(location) {
        return location.id === id;
      });
    });
  },
  all: function() {
    if(cachePromise === null) this.refresh();
    return cachePromise;
  },
  search: function(query) {
    if(cachePromise === null) this.refresh();
    return cachePromise.then(function(locations) {
      return Promise.all(elasticIndex.search(query, {fields: boosts}).map(function(result) {
        return this.get(result.ref).then(function(location) {
          return {
            location: location,
            relevance: result.score
          }
        })
      }.bind(this)))
    }.bind(this))
  },
  refresh: function() {
    cachePromise = new Promise(function(resolve, reject) {
      client.select().all(function(error, records) {
        if(error) reject(error);
        else resolve(records);
      })
    }).then(this.index.bind(this))
    return cachePromise;
  },
  index: function(records) {
    records.map(this._createDocument.bind(this))
    .forEach(function(doc) {
      elasticIndex.addDoc(doc);
    })
    return records;    
  },
  _createDocument: function(record) {
    return {
      "id": record.id,
      "Name": record.get("Name"),
      "Address": record.get("Address"),
      "Service Names": joinFields(record, ["Service 1 Name", "Service 2 Name", "Service 3 Name"]),
      "Service Descriptions": joinFields(record, ["Service 1 Description", "Service 2 Description", "Service 3 Description"]),
      "Service Categories": joinFields(record, ["Service 1 Categories", "Service 2 Categories", "Service 3 Categories"]),
      "Search": record.get("Search")
    }
  },
}

function joinFields(record, fields) {
  return fields.map(function(field) {
    return record.get(field)
  }).reduce(function(acc, el) {
    return acc.concat(el)
  }, []).join(" ");
}
