var config = require('./config');

const CATEGORIES_TAB_IDENTIFIER="Categories";

// Module locals
var client = config.client()(CATEGORIES_TAB_IDENTIFIER);
var cachePromise = null;

module.exports = {
  all: function() {
    if(cachePromise === null) this.refresh();
    return cachePromise;
  },
  refresh: function() {
    cachePromise = new Promise(function(resolve, reject) {
      client.select().all(function(error, records) {
        if(error) reject(error);
        else resolve(records);
      })
    })
    return cachePromise;
  }
}
