(function() {
  var fs, glob, jquerySource, path, qqunit;
  var __hasProp = Object.prototype.hasOwnProperty;

  glob = require('glob');

  fs = require('fs');

  path = require('path');

  qqunit = require('qqunit');

  jquerySource = fs.readFileSync(path.join(__dirname, 'lib', 'jquery.js')).toString();

  qqunit.Environment.jsdom.jQueryify(window, path.join(__dirname, 'lib', 'jquery.js'), function(window, jQuery) {
    var Helper, k, tests, v;
    global.jQuery = jQuery;
    Helper = require('./batman/test_helper');
    for (k in Helper) {
      if (!__hasProp.call(Helper, k)) continue;
      v = Helper[k];
      global[k] = v;
    }
    global.Batman = require('../src/batman.node');
    Batman.exportGlobals(global);
    Batman.Request.prototype.send = function() {
      throw new Error("Can't send requests during tests!");
    };
    tests = glob.sync("" + __dirname + "/batman/**/*_test.coffee");
    console.log("Running Batman test suite. " + tests.length + " files required.");
    return qqunit.Runner.run(tests, function(stats) {
      return process.exit(stats.failed);
    });
  });

}).call(this);
