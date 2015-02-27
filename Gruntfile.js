module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      requirejs: {
        compile: {
          options: {
            paths: {
              settings: 'settings.build',
            },
            map: {
              '*': {
                'underscore': 'lodash'
              }
            },
            mainConfigFile: "src/js/main.build.js",
            appDir: "src",
            baseUrl: "js",
            dir: "dist",
//            name: "main",
            fileExclusionRegExp: /^(intro.js)|(outro.js)|(^\.)$/,
            removeCombined: true,
            keepBuildDir: false,
            optimize: 'uglify2',
            findNestedDependencies: true,
            generateSourceMaps: true,
            preserveLicenseComments: false,
		    onBuildWrite: function (moduleName, path, singleContents) {
              return singleContents.replace(/jsx!/g, '');
            },
            modules: [{
              name: "main",
              exclude: ['jsx']
            }]
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
          'no-colors': true,
          engine : 'slimerjs'
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
            port: 3000,
            server: "server-test.js"
          }
        },
        proxy: {
          options: {
            hostname: '*',
            port: 8003,
            server: "server-proxy.js"
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
      },
      bower: {
        serve: {
          rjsConfig: 'src/js/main.js',
          options: {
            exclude: ['prism', 'react']
          }
        },
        build: {
          rjsConfig: 'src/js/main.build.js',
          options: {
            exclude: ['prism', 'react']
          }
        }
      },
      bower_concat: {
        all: {
          cssDest: 'src/css/components.min.css',
          exclude: ["fontawesome"],
          mainFiles: {
            'prism': ['prism.js', 'themes/prism-okaidia.css']
          }
        }
      },
      concat: {
        options: {
          separator: ';',
        },
        prism: {
          src: [
            'src/components/prism/components/prism-core.js',
            'src/components/prism/components/prism-clike.js',
            'src/components/prism/components/prism-qore.js',
            'src/components/prism/components/prism-sql.js',
          ],
          dest: 'src/components/prism/prism.js',
        },
      },
      copy: {
        all: {
          files: [{
            expand: true,
            src: "src/components/fontawesome/css/*",
            dest: "src/css/font-awesome/css/"
          },
          {
            expand: true,
            src: "src/components/fontawesome/fonts/*",
            dest: "src/css/font-awesome/fonts/"
          }]
        },
        build: {
          files: [{
            src: "src/js/main.js",
            dest: "src/js/main.build.js"
          }]
        }
      },
      clean: {
        build: ["dist/components", "src/js/main.build.js"]
      },
      open : {
        dev : {
          path: 'http://127.0.0.1:3000/',
          app: 'Google Chrome'
        },
      }
    });
  
  require('matchdep').filterDev(['grunt-*','!grunt-cli']).forEach(grunt.loadNpmTasks);
  
  grunt.registerTask('default', ['jshint', 'copy', 'concat', 'bower', 'bower_concat', 'express', 'casper', 'requirejs']);
  grunt.registerTask('serve', ['copy', 'bower:serve', 'concat', 'bower_concat', 'express:server', 'express-keepalive']);
  grunt.registerTask('serve-both', ['express:api', 'express:proxy', 'express:server', 'express-keepalive']);
  grunt.registerTask('test', ['copy', 'concat', 'bower_concat', 'express:api', 'express:proxy', 'express:server', 'casper:test']);
  grunt.registerTask('build', ['copy:all', 'copy:build', 'concat', 'bower:build', 'bower_concat', 'requirejs:compile', 'clean:build']);
};