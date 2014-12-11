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
      },
      casper : {
        options : {
          test : true,
          parallel : true,
          pre : 'tests/pre.js',
          concurrency : 5
        },
        test : {
          src: ['tests/tests'],
          dest : 'casperjs-report.xml'
        }
      },
      express: {
        api: {
          options: {
            hostname: '*',
            port: 3030,
            server: "api/server.js"
          }
        },
        server: {
          options: {
            hostname: '*',
            port: 3000,
            server: "server-test.js"
          }
        }
      }
    });
  
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-express');
//  grunt.registerTask('srvr', ['express', 'express-keepalive']);
  
  grunt.registerTask('default', ['jshint', 'express', 'casper', 'requirejs']);
  grunt.registerTask('serve', ['express', 'express-keepalive']);
  grunt.registerTask('test', ['express', 'casper:test']);
};