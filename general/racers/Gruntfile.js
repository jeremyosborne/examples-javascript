var path = require("path");

module.exports = function(grunt) {

    var libSourceFiles = [
        //"lib/handlebars.js",
        "lib/handlebars_runtime.js",
        "lib/jquery.js",
    ];
    
    var testFiles = [
        'test/handlebars_helpers.js',
        'test/mixins.js',
        'test/raceentry.js',
        'test/racer.js',
        'test/racetrack.js',
        'test/random.js',
        'test/utils.js',
    ];
    
    var serverSourceFiles = [
        "Gruntfile.js",
        "src/db.js",
        "src/handlebars_renderengine.js",
        "app.js",
        "app2.js",
        "app3.js",
        "simplesimulation.js",
        "simplesimulation3.js",
    ];

    var browserSourceFiles = [
        "src/utils.js",
        "src/mixins.js",
        "src/random.js",
        "src/racer.js",
        "src/raceentry.js",
        "src/racetrack.js",
        "src/handlebars_helpers.js",
        "src/polyfill.js",
        //"src/browserapp.js",
        //"src/browserapp2.js",
        "src/browserapp3.js",
    ];
    
    var transpiledTemplates = [
        "templates/race-entries.hb", 
        "templates/standings.hb",
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            jsRoot: 'www/js',
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: libSourceFiles.concat(browserSourceFiles),
                dest: '<%= meta.jsRoot %>/<%= pkg.name %>.js',
            },
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "TEMPLATES",
                    processName: function(filename) {
                        console.log(filename);
                        return path.basename(filename, ".hb").toLowerCase();
                    },
                    compilerOptions: {
                        knownHelpers: {
                            "get": true,
                        },
                        knownHelpersOnly: false
                    },
                },
                files: {
                    "transpiled_templates/TEMPLATES.js": transpiledTemplates,
                }
            }
        },
        jshint: {
            server: {
                files: {
                    src: testFiles.concat(serverSourceFiles),
                },
                options: {
                    browser: false,
                    boss: false,
                    curly: true,
                    devel: true,
                    eqeqeq: false,
                    eqnull: true,
                    immed: true,
                    jquery: false,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    node: true,
                    sub: true,
                    undef: true,
                },
                globals: {},
            },
            browser: {
                files: {
                    src: browserSourceFiles,
                },
                options: {
                    browser: true,
                    boss: false,
                    curly: true,
                    devel: true,
                    eqeqeq: false,
                    eqnull: true,
                    es5: false,
                    immed: true,
                    jquery: true,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    node: false,
                    sub: true,
                    undef: true,
                },
                globals: {},
            }
        },
        nodeunit: {
            all: testFiles,
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            },
            dist: {
                files: {
                    '<%= meta.jsRoot %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
                },
            },
        },
        watch: {
            scripts: {
                files: testFiles.concat(serverSourceFiles).concat(browserSourceFiles),
                tasks: ['jshint', 'nodeunit', 'concat'],
                options: {
                    debounceDelay: 750,
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
        'jshint', 
        'nodeunit', 
        'handlebars',
        'concat',
        'watch',
    ]);
    grunt.registerTask('dist', [
        'jshint', 
        'nodeunit', 
        'handlebars', 
        'concat',
        'uglify',
    ]);
};
