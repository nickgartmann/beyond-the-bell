var ElasticLunr = require("elasticlunr");
var config = require('./config');

const ORGANIZATIONS_TAB_IDENTIFIER="Organizations";

// Module locals
var client = config.client()(ORGANIZATIONS_TAB_IDENTIFIER);
var cachePromise = null;

const boosts = {
  "Name": {boost: 1},
  "Address": {boost: 0.25},
  "Mission Statement": {boost: 1},
  "Description": {boost: 1},
  "Nicknames": {boost: 3},
  "Search": {boost: 3},
  "Categores": {boost: 1}
}

var elasticIndex = ElasticLunr(function() {
  Object.keys(boosts).forEach(this.addField.bind(this))
});

module.exports = {
  get: function(id) {
    if(cachePromise === null) this.refresh();
    return cachePromise.then(function(allOrganizations) {
      return allOrganizations.find(function(organization) {
        return organization.id === id;
      });
    });
  },
  all: function() {
    if(cachePromise === null) this.refresh();
    return cachePromise;
  },
  search: function(query) {
    if(cachePromise === null) this.refresh();
    return cachePromise.then(function(organizations) {
      return Promise.all(elasticIndex.search(query, {fields: boosts}).map(function(result) {
        return this.get(result.ref).then(function(organization) {
          return {
            organization: organization,
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
      "Mission Statement": record.get("Mission Statement"), 
      "Description": record.get("Description"),
      "Nicknames": record.get("Organization nicknames"), 
      "Categories": (record.get("Categories") || []).join(" "),
      "Search": record.get("Search")
    }
  },
}
