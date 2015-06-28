module.exports = function(grunt) {

  grunt.initConfig({
    coveralls: {
      // Options relevant to all targets
      src: 'test/coverage.lcov',
      options: {
        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: false
      }
    }
  });

grunt.loadNpmTasks('grunt-coveralls');

};