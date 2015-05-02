
describe('tdot', function() {
  var tdot,
      TEST_KEY = '166a657e37104b7e89bd710cf13929b1',
      A_NUMBER = 42;

  beforeEach(function() {
    // we always want a fresh tdot
    delete require.cache[require.resolve('../tdot.js')];
    tdot = require('../tdot.js');
  });


  describe('setKey', function() {

    it('should require a key', function() {
      expect( function() { tdot.setKey() }).toThrow(new Error('You must provide an API key'));
    });

    it('should return key as a string', function() {
      var keyResponse = tdot.setKey(A_NUMBER);
      expect(keyResponse).toBe(A_NUMBER.toString());
    });
  });

  describe('getKey', function() {

    it('should return undefined for no key', function() {
      expect(tdot.getKey()).toBe(undefined);
    });

    it('should return the key that has been set', function() {
      tdot.setKey(TEST_KEY);
      expect(tdot.getKey()).toBe(TEST_KEY);
    });

  });

  describe('getData', function() {
    var mockery = require('mockery'),
        endpoint = 'some_fake_endpoint';
        mockHttps = jasmine.createSpyObj('https', ['get']);

    mockery.registerAllowable('../tdot.js'); // we probably shouldn't mock the module we are testing... :)
    mockery.registerMock('https', mockHttps);
    mockery.enable();

    describe('without api key', function() {
      it('should require an api key to be set before calling getData', function() {
        expect( function() { 
          tdot.getData(A_NUMBER, function() {}); 
        }).toThrow(new Error('You must provide an API key'));
      });
    });

    describe('with api key', function() {
      beforeEach(function() {
        tdot.setKey(TEST_KEY);
      });

      it('should require endpoint be a string', function() {
        expect( function() { 
          tdot.getData(A_NUMBER, function() {});
        }).toThrow(new Error('The endpoint must be a string'));
      });

      it('should call https.get() function', function() {
        tdot.getData(endpoint, function() {});
        expect(mockHttps.get).toHaveBeenCalled();
      });

      it('should call https.get() with expected options', function() {
        var httpsGetOptions;
        mockHttps.get.andCallFake(function(options) {
          httpsGetOptions = options;
        });

        tdot.getData(endpoint, function() {});

        expect( httpsGetOptions.hostname ).toBe('www.tdot.tn.gov');
        expect( httpsGetOptions.path ).toBe('/opendata/api/data/' + endpoint);
        expect( httpsGetOptions.headers.Accept ).toBe('Application/hal+json');
        expect( httpsGetOptions.headers.ApiKey ).toBe(TEST_KEY);

      });

      it('should call https.get() with a callback function', function() {
        var httpGetCallback;
        mockHttps.get.andCallFake(function(options, callback) {
          httpGetCallback = callback;
        });

        tdot.getData(endpoint, function() {});

        expect( httpGetCallback ).toEqual(jasmine.any(Function));
      });
    });
  });
});
