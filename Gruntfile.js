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
      }
    });
  
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  
  grunt.registerTask('default', ['requirejs']);
};
