var config = require('./config');

const ORGANIZATIONS_TAB_IDENTIFIER="Organizations";

// Module locals
var client = config.client()(ORGANIZATIONS_TAB_IDENTIFIER);
var cachePromise = null;

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
  search: function() {
    if(cachePromise === null) this.refresh();
    return cachePromise.then(function(organizations) {
      // TODO: execute the search
      return organizations;
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
    
  }
}
