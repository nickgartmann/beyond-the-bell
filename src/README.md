# Beyond The Bell

This library allows read access to all of the Organizations,
Locations, Services, and Categories collected and maintanied
by [Beyond the Bell](http://beyondthebellmke.org).

## Install
```bash
npm install --save beyond-the-bell
```

## Usage

```javascript
var BtB = require("beyond-the-bell");

// List all Organizations
BtB.Organizations.all().then(function(orgs) {
  orgs.forEach(function(org) {
    console.log(org.get("Name"));
  })
})

// List all Locations
BtB.Locations.all().then(function(locations) {
  locations.forEach(function(location) {
    console.log(location.get("Name"), location.get("Address"));
  })
})

// Search for a location
BtB.Locations.search("Library").then(function(results) {
  results.forEach(function(result) {
    console.log(result.location.get("Name"));
    console.log(result.relevance);
  })
})
```

## Models

### Organization

#### Fields

* `Name`
* `Mission Statement`
* `Description`
* `Address`
* `Phone Number`
* `Website`
* `Photo` - An array of all photos provided by the Organization
* `Locations` - An array of ids pointing to valid Location objects
* `Logo` - An array of provided logos
* `Organization nicknames` - Other names the organization goes by
* `Categories`

#### Methods

* `get(id)` - returns a promise which resolves to the organization with the provided string id, or null if there is no organization with that id.
* `all()` - returns a promise which resolves to an array of all of the organizations.
* `search(query)` - returns a promise which resolves to an array of results of the form `{organization: OrganizationModel, relevance: float}` where `relevance` is a decimal between `0` and `1` with `1` being the most relevant possible.
* `refresh()` - forces a reload of all of the organizations, since the library caches the list aggressively.

### Locations

#### Fields

* `Name`
* `Organization` - An array of the organizations this location is associated with (realistically should be a single item)
* `Address`
* `Phone Number`
* `Primary Contact Name`
* `Primary Contact Email Address`
* `Operating Hours`
* `Service 1 Name`
* `Service 1 Description`
* `Service 1 Fee`
* `Service 1 Registration` - An array of strings representing the types of registration. Either `"Drop in"` or `"Advance registration required"`
* `Service 1 Grade Levels Served` - An array of strings showing the different age groups served.
* `Service 1 Categories`
* `Service 2 Name`
* `Service 2 Description`
* `Service 2 Fee`
* `Service 2 Registration`
* `Service 2 Grade Levels Served`
* `Service 2 Categories`
* `Service 3 Name`
* `Service 3 Description`
* `Service 3 Fee`
* `Service 3 Registration`
* `Service 3 Grade Levels Served`
* `Service 3 Categories`
* `Other Services`
* `Latitude`
* `Longitude`

#### Methods

* `get(id)` - returns a promise which resolves to the location with the provided string id, or null if there is no location with that id.
* `all()` - returns a promise which resolves to an array of all of the locations.
* `search(query)` - returns a promise which resolves to an array of results of the form `{location: LocationModel, relevance: float}` where `relevance` is a decimal between `0` and `1` with `1` being the most relevant possible.
* `refresh()` - forces a reload of all of the locations, since the library caches the list aggressively.

### Categories

#### Fields

* `Name`
* `Display Name`

#### Methods
* `all()` - returns a promise which resolves to an array of all of the categories.
