/**
 * Loop through all entries in our user agents object and test everything.
 *
 * @see  src/useragents.js
 * @author hannes.diercks@jimdo.com
 */

var g
  , ua
  , p
  , assert = require('assert')
  , browser = require('../src/bowser')
  , allUserAgents = require('../src/useragents').useragents

/**
 * Get the length of an object.
 * http://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
 *
 * @param  {Object} obj
 * @return {Number}
 */
function objLength(obj) {
  var size = 0
    , key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++
  }
  return size
}

function objKeys(obj) {
  var keys = []
    , key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key)
    }
  }
  keys.sort();
  return keys.join(', ')
}

/* Groups */
for (g in allUserAgents) { (function(group, userAgents) {
  describe(group, function() {

    /* User Agents */
    for (ua in userAgents) { (function(userAgent, expections) {
      describe('user agent "' + userAgent + '"', function() {

        expections.name = group

        /* Get the result from bowser. */
        var result = browser._detect(userAgent)

        /* At first, check if the result has the correct length. */
        it('should have ' + objLength(expections) + ' properties', function() {
          assert.equal(objKeys(result), objKeys(expections))
        })

        /* Properties */
        for (p in expections) { (function(property, value, resultValue) {

          /* Now ensure correctness of every property. */
          it('\'s Property "' + property + '" should be ' + value, function() {
            assert.equal(resultValue, value)
          })

        })(p, expections[p], result[p])}

      })
    })(ua, userAgents[ua])}

  })
})(g, allUserAgents[g])}

var comparisionsTasks = [
  ['9.0', '10', -1],
  ['11', '10', 1],
  ['1.10.2.1',  '1.8.2.1.90', 1],
  ['1.010.2.1', '1.08.2.1.90', 1],
  ['1.10.2.1', '1.10.2.1', 0],
  ['1.10.2.1', '1.0800.2', -1],
];

describe('Browser versions comparision', function() {

  for(g in comparisionsTasks) {
    var task = comparisionsTasks[g],
        version = task[0],
        version2 = task[1],
        matching = task[2] === 0 ? ' == ' : (task[2] > 0) ? ' > ' : ' < ';
    it('version ' + version + ' should be' + matching + 'version ' + version2, function(){
      assert.equal(browser.compareVersions([version, version2]), task[2]);
    })
  }
});
