var config = require('./config');

const LOCATIONS_TAB_IDENTIFIER="Locations";

// Module locals
var client = config.client()(LOCATIONS_TAB_IDENTIFIER);
var cachePromise = null;

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
  search: function() {
    if(cachePromise === null) this.refresh();
    return cachePromise.then(function(locations) {
      // TODO: execute the search
      return locations;
    })
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
    return records;    
  }
}
