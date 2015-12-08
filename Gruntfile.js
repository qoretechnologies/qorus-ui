module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      requirejs: {
        compile: {
          options: {
            baseUrl: "src",
            mainConfigFile: "src/js/app.build.js",
            appDir: "src",
            baseUrl: "js",
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
          concurrency : 5,
          'no-colors': true
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
            port: 8001,
            server: "api/server.js"
          }
        },
        server: {
          options: {
            hostname: '*',
            port: 3001,
            server: "server-test.js"
          }
        }
      },
      watch: {
        scripts: {
          files: ['src/**/*.js'],
          tasks: ['serve'],
          options: {
            interrupt: true,
            spawn: true,
            atBegin: true
          },
        },
      }
    });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'express', 'casper', 'requirejs']);
  // grunt.registserTask('serve', ['http']);
  grunt.registerTask('serve', ['express:server', 'express-keepalive']);
  grunt.registerTask('both', ['express:api', 'express:server', 'express-keepalive']);
  grunt.registerTask('test', ['express:api', 'express:server', 'casper:test']);
  grunt.registerTask('both', ['express:api', 'express:server', 'express-keepalive']);
};
