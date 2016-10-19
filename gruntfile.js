module.exports = function (grunt) {
   grunt.initConfig({
	   babel: {
	        dist: {
	            files: {
	                'dist/emit.js': 'lib/emit.js'
	            }
	        }
	    },
      watch: {
         scripts: {
            files: ["./lib/**/*.js", "test/**/*.js"]
         }
      }
   });

   grunt.loadNpmTasks('grunt-babel');

   grunt.registerTask("default", ["watch"]);
   grunt.registerTask("build", ["babel"]);
};
