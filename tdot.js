var _https = require('https'),
  _key,
  _transform = function (tdotitem) {
    var properties = tdotitem.properties,
      coords = (!!properties.locations) ? properties.locations[0].coordinates[0] : properties.location.coordinates[0];
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [coords.lng, coords.lat]
      },
      "properties": _properties(properties)
    };
  },
  _properties = function (tdotprops) {
    delete tdotprops.locations;
    delete tdotprops.location;
    return tdotprops;
  };

module.exports = {
  setKey: function (key) {
    if (!!key) {
      return _key = key.toString();
    }
    else {
      return 'You did not enter a correct value';
    }
  },
  getKey: function(){
    return _key;
  },
  getData: function (endpoint, callback, returnJSON) {
    var file, result = '', options = {
      hostname: 'www.tdot.tn.gov',
      path: '/opendata/api/data/' + endpoint,
      headers: {
        'Accept': 'Application/hal+json',
        'ApiKey': _key
      }
    };
    if (typeof _key !== 'string') {
      return 'Please set the key';
    }
    if (typeof endpoint !== 'string') {
      return 'The endpoint must be a string';
    }
    _https.get(options, function (res) {
      //console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        result += chunk;
      });
      res.on('error', function (e) {
        console.log(e.message);
      });
      res.on('end', function (end) {
        if (res.statusCode !== 200) {
          callback('There was an error');
          return;
        }
        if (returnJSON) {
          result = JSON.parse(result);
        }
        callback(result, endpoint);
      });
    });
  },
  makeGeoJSON: function (tdotJSON) {
    //http://geojson.org/geojson-spec.html
    var items = tdotJSON._embedded.items,
      geoitems = items.map(_transform);
    return {
      "type": "FeatureCollection",
      "features": geoitems
    };
  }
};