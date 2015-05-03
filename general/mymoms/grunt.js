/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    var config = {
        pkg : '<json:package.json>',
        qunit : {
            files : ['test/**/*.html']
        },
    };

    grunt.initConfig(config);
    grunt.registerTask('test', 'qunit');
};
