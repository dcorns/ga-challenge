/**
 * server_test
 * Created by dcorns on 9/8/15
 * Copyright © 2015 Dale Corns
 * API test using supertest and mocha and chai. The testing is excessive to demonstrate different tools
 */
'use strict';

var request = require('supertest'),
    expect = require('chai').expect;
//Start by describing the broadest description of the test
describe('Route testing', function(){
  //provide the server app to all sub tests using beforeEach, not that app is declared before being used in beforeEach as it needs to be available to each test for accessing the server.
var app;
  beforeEach(function(){
    app = require('../../api/server');
  });
  //Each subtest starts with an assertion statement using 'it'
  it('responds to /', function(done){//done needs to be used in order to indicate a test has been completed. Use it as the argument to the function
  request(app)//starts and/or connects to server
  .get('/')//make a get request for '/'
    //using expect assert that the status return will be 200, (ok) if it is not, the test will fail
  .expect(200, done); //add done as the last parameter of the last expect call in the sub test
  });
  it('GET /favorites', function(done){
    request(app)
      .get('/favorites')
      .expect(function(res){//using expect and a single function, we can pass the response object in and perform whatever test we would like to make against the response object using a pattern of if not true throw and error
        if (!(Array.isArray(res.body))) throw new Error('Response body is not an array');
        if (res.body.length > 0){
          if(!(res.body[0].Title)) throw new Error('Response body array[0] has no Title value');
          if(!(res.body[0].Year)) throw new Error('Response body array[0] has no Year value');
          if(!(res.body[0].imdbID)) throw new Error('Response body array[0] has no imdbID value');
          if(!(res.body[0].Type)) throw new Error('Response body array[0] has no Type value');
          //up until this point the expect use of the expect calls did not need chai. chai adds additional functionality to expect which we will demonstrate here
          expect(res.body[0]).to.have.property('Title');
          expect(res.body[0].Title).to.not.equal('null');
          expect(res.body[0]).to.have.property('Year');
          expect(res.body[0].Year).to.not.equal('null');
          expect(res.body[0]).to.have.property('imdbID');
          expect(res.body[0].imdbID).to.not.equal('null');
          expect(res.body[0]).to.have.property('Type');
          expect(res.body[0].Type).to.not.equal('null');
        }
      })
      .expect(200, done);
  });
  it('POST /favorites using ajax writes and returns the new array containing the added favorite', function(done){
    request(app)
      .post('/favorites')
      .send({'Title': 'Test Title', Year: 'Test Year', imdbID: 'Test imdbID', Type: 'Type Test'})
      .expect(function(res){
        if (!(Array.isArray(res.body))) throw new Error('Response body is not an array');
        expect(res.body[res.body.length-1]).to.have.property('Title');
        expect(res.body[res.body.length-1].Title).to.be.equal('Test Title');
        expect(res.body[res.body.length-1]).to.have.property('Year');
        expect(res.body[res.body.length-1].Year).to.be.equal('Test Year');
        expect(res.body[res.body.length-1]).to.have.property('imdbID');
        expect(res.body[res.body.length-1].imdbID).to.be.equal('Test imdbID');
        expect(res.body[res.body.length-1]).to.have.property('Type');
        expect(res.body[res.body.length-1].Type).to.be.equal('Type Test');
      })
      .expect(200, done);
  });

  it('404 to invalid requests', function(done){
    request(app)
      .get('/foo')
      .expect(404, done);
  });

});