var assert = require('assert'),
    http = require('http');

    console.log("in testing");

describe('URL Testing for Financial Setting Page', function () {
  it('Testing marketAreas for the groupID G00005', function (done) {
    http.get('http://localhost:3000/api/corpdb/group/G00005/marketArea', function (response) {
       var marketArea = '';
      response.on('data', function (marketAreas) {
        marketArea = marketAreas;
      });
      response.on('end', function () {
        assert.equal("WM of Southern California", JSON.parse(marketArea)[0].ma_name);
        assert.equal("WM of Four Corners", JSON.parse(marketArea)[1].ma_name);
        assert.equal("WM of Northern California", JSON.parse(marketArea)[2].ma_name);
        assert.equal("WM of Texas Oklahoma", JSON.parse(marketArea)[3].ma_name);
        assert.equal("WM of Gulf Coast", JSON.parse(marketArea)[4].ma_name);
        assert.equal("WM of Ark Tenn Alabama Kentucky", JSON.parse(marketArea)[5].ma_name);
        assert.equal("WM of South Atlantic", JSON.parse(marketArea)[6].ma_name);
        assert.equal("WM of Florida", JSON.parse(marketArea)[7].ma_name);
        done();
      });
    });
  });


  it('Testing marketAreas for the groupID G00004', function (done) {
    http.get('http://localhost:3000/api/corpdb/group/G00004/marketArea', function (response) {
      var marketArea = '';
      response.on('data', function (marketAreas) {
        marketArea = marketAreas;
      });
      response.on('end', function () {
        assert.equal("WM of Western Canada", JSON.parse(marketArea)[0].ma_name);
        assert.equal("WM of Eastern Canada", JSON.parse(marketArea)[1].ma_name);
        assert.equal("WM of Pacific Northwest BC", JSON.parse(marketArea)[2].ma_name);
        assert.equal("WM of WPA MD WV VA", JSON.parse(marketArea)[3].ma_name);
        assert.equal("WM of Wisconsin Minnesota", JSON.parse(marketArea)[4].ma_name);
        assert.equal("WM of Greater Mid Atlantic", JSON.parse(marketArea)[5].ma_name);
        assert.equal("WM of Michigan Ohio Indiana", JSON.parse(marketArea)[6].ma_name);
        assert.equal("WM of Illinois Missouri Valley", JSON.parse(marketArea)[7].ma_name);
        done();
      });
    });
  });


   it('Testing facilities for the groupID and marketArea G00005/K00175', function (done) {
    http.get('http://localhost:3000/api/corpdb/marketArea/K00175/facilities', function (response) {
       var facility = '';
      response.on('data', function (facilities) {
        facility = facilities;
      });
      response.on('end', function () {
        assert.equal("Transfer Station", JSON.parse(facility)[0].facility_type);
        assert.equal("Disposal", JSON.parse(facility)[1].facility_type);
        assert.equal("Collection", JSON.parse(facility)[2].facility_type);
        assert.equal("MRF Recycling", JSON.parse(facility)[3].facility_type);
        done();
      });
    });
  });


   it('Testing facilities for the groupID and marketArea G00004/K00202', function (done) {
    http.get('http://localhost:3000/api/corpdb/marketArea/K00202/facilities', function (response) {
      var facility = '';
      response.on('data', function (facilities) {
        facility = facilities;
      });
      response.on('end', function () {
        assert.equal("Transfer Station", JSON.parse(facility)[0].facility_type);
        assert.equal("Disposal", JSON.parse(facility)[1].facility_type);
        assert.equal("Collection", JSON.parse(facility)[2].facility_type);
        assert.equal("MRF Recycling", JSON.parse(facility)[3].facility_type);
        done();
      });
    });
  });


   it('Testing BU for the groupID, marketArea and facility G00005/K00175/1', function (done) {
    http.get('http://localhost:3000/api/corpdb/marketArea/K00175/facilities/1/businessUnit', function (response) {
      var BU = '';
      response.on('data', function (businessUnit) {
        BU = businessUnit;
      });
      response.on('end', function () {
        assert.equal("Atascadero Waste Alternatives", JSON.parse(BU)[0].bu_name);
        assert.equal("Vandenberg AFB", JSON.parse(BU)[1].bu_name);
        assert.equal("Santa Ana Hauling", JSON.parse(BU)[2].bu_name);
        assert.equal("Carlsbad Hauling", JSON.parse(BU)[3].bu_name);
        done();
      });
    });
  });


   it('Testing BU for the groupID, marketArea and facility G00004/K00202/4', function (done) {
    http.get('http://localhost:3000/api/corpdb/marketArea/K00202/facilities/4/businessUnit', function (response) {
      var BU = '';
      response.on('data', function (businessUnit) {
        BU = businessUnit;
      });
      response.on('end', function () {
        assert.equal("City of Edmonton MRF", JSON.parse(BU)[0].bu_name);
        assert.equal("Winnipeg Hauling", JSON.parse(BU)[1].bu_name);
        assert.equal("Fort McMurray Hauling", JSON.parse(BU)[2].bu_name);
        assert.equal("Red Deer MRF", JSON.parse(BU)[3].bu_name);
        done();
      });
    });
  });


   it('Testing LOBs for the groupID, marketArea, facility and BU G00005/K00175/1/B01369', function (done) {
    http.get('http://localhost:3000/api/corpdb/marketArea/K00175/facilities/1/businessUnit/B01369/lobMaterialStream', function (res) {
      var LOB = '';
      res.on('data', function (lobs) {
        LOB = lobs;
      });
      res.on('end', function () {
        assert.equal("Commercial Recycle", JSON.parse(LOB)[0].lobms);
        assert.equal("Commercial MSW", JSON.parse(LOB)[1].lobms);
        assert.equal("Roll Off", JSON.parse(LOB)[6].lobms);
        done();
      });
    });
  });


   it('Testing quarters for the groupID, marketArea, facility and BU G00005/K00117/1/B00289/1', function (done) {
    http.get('http://localhost:3000/api/corpdb/businessUnit/B00289/lobMaterialStream/1/quarter', function (response) {
      var quarter = '';
      response.on('data', function (quarters) {
          quarter = JSON.parse(quarters);
      });
      response.on('end', function () {
        assert.equal("4Q2014-3Q2015", quarter.appliedQuarter);
        assert.equal("1Q2014-3Q2015", quarter.availableQuarter);
        done();
      });
    });
  });
});
