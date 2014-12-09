module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      requirejs: {
        compile: {
          options: {
            baseUrl: "src",
            mainConfigFile: "src/js/app.build.js",
            dir: "dist"
          }
        }
      },
      jshint: {
        files: ['Gruntfile.js', 'src/js/**/*.js', '!src/js/libs/**', '!src/js/app.build.js'],
        options: {
          "predef": {
              "$": true,  
              "define": true, 
              "require": true,
              "jQuery": true, 
              "later": true,
              "cronParser": true,
              "moment": true,
              "debug": true,
              "sprintf": true,
              "Backbone": true,
              "window": true
          },
          "strict": false,
          "unused": false,
          "browser": true,
          "devel": true,
          "indent": 2,
          "white": false,
          "curly": false
        }
      }
    });
  
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.registerTask('default', ['jshint', 'requirejs']);
};
