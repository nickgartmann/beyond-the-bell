var Airtable = require("airtable");

// Default API key has read only permissions
const DEFAULT_API_KEY="keyny2au7X26OArX8";
const BASE_IDENTIFIER="appSyqxd0VNFjiGg2";

module.exports = {
  client: function(key) {
    if(key === undefined) key = DEFAULT_API_KEY;
    return new Airtable({
      apiKey: key,
    }).base(BASE_IDENTIFIER)
  }
}
