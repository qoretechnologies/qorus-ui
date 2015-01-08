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
            name: "main",
            fileExclusionRegExp: /^(intro.js)|(outro.js)|(^\.)$/,
            removeCombined: true,
            keepBuildDir: false,
            optimize: 'uglify2',
            findNestedDependencies: true,
            generateSourceMaps: true,
            preserveLicenseComments: false
          }
        },
        cmake: {
          options: {
            paths: {
              settings: 'settings.build',
            },
            map: {
              '*': {
                'underscore': 'lodash'
              }
            },
            mainConfigFile: "@CMAKE_SOURCE_DIR@/webapp/src/js/main.js",
            dir: "@CMAKE_BINARY_DIR@/webapp",
            appDir: "@CMAKE_SOURCE_DIR@/webapp/src",
            baseUrl: "js",
            name: "main",
            fileExclusionRegExp: /^(intro.js)|(outro.js)|(^\.)$/,
            removeCombined: true,
            keepBuildDir: false,
            optimize: 'uglify2',
            findNestedDependencies: true,
            generateSourceMaps: true,
            preserveLicenseComments: false
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
        build: {
          rjsConfig: 'src/js/main.build.js',
          options: {
            exclude: ['prism']
          }
        },
        cmake: {
          rjsConfig: '@CMAKE_SOURCE_DIR@/webapp/src/js/main.js',
          options: {
            exclude: ['prism']
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
        build: ["dist/components", "src/js/main.build.js"],
        cmake: ["@CMAKE_BINARY_DIR@/webapp/components"]
      }
    });
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-requirejs');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');


  
  grunt.registerTask('default', ['jshint', 'copy', 'concat', 'bower', 'bower_concat', 'express', 'casper', 'requirejs']);
  grunt.registerTask('serve', ['copy', 'bower_concat', 'express:server', 'express:proxy', 'express-keepalive']);
  grunt.registerTask('serve-both', ['express:api', 'express:proxy', 'express:server', 'express-keepalive']);
  grunt.registerTask('test', ['copy', 'concat', 'bower_concat', 'express:api', 'express:proxy', 'express:server', 'casper:test']);
  grunt.registerTask('build', ['copy', 'concat', 'bower:build', 'bower_concat', 'requirejs:compile', 'clean:build']);
  grunt.registerTask('cmake', ['copy', 'concat', 'bower:cmake', 'bower_concat', 'requirejs:cmake', 'clean:cmake']);
};