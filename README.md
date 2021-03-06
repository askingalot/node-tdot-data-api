# TDOT Data API Node Module

Module for retrieving data from the TDOT Data API. Will create [GeoJSON](http://geojson.org/geojson-spec.html) from TDOT JSON that has location information.

*.geojson files are example output, not current to TDOT operations.*

## Methods

### setKey(key)

#### Properties

key: string

Returns: string

### getKey()

Returns: string

### getData(endpoint, callback, returnJSON)

#### Properties

endpoint: string, name of data endpoint

callback: function, what to pass result to

returnJSON: boolean, do you want the data returned as JSON?

Returns: string or JSON

```
var tdot = require('./tdot');

tdot.setKey('xxxxxxxxxxxxxx');

tdot.getData('RoadwayIncidents', function(result, name){
  console.log(name);
  console.log(result);
});
```

### makeGeoJSON(tdotJSON)

#### Properties

tdotJSON: JSON, TDOT formatted JSON

Returns: [GeoJSON](http://geojson.org/geojson-spec.html)

