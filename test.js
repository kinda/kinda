"use strict";

var assert = require('chai').assert;
var KindaClass = require('./');

suite('KindaClass', function() {
  var Person = KindaClass.extend('Person', function() {
    this.hello = function() {
      return 'hello';
    };
  });

  test('isKindaClass', function() {
    assert.ok(Person.isKindaClass());
  });

  test('instantiate', function() {
    var mvila = Person.instantiate();
    assert.equal(mvila.getClass(), Person);
    assert.ok(mvila.isInstanceOf(Person));
  });
});
