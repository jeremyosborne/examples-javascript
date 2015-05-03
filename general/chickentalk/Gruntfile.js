// Grunt 0.4 compliant.
// Extra documentation included since this will be a baseline for later 
// projects. Documentation will focus on things that I don't think the regular
// docs make abundantly clear, or notes I might want for myself.

module.exports = function(grunt) {

    // Some things don't change. Grunt is still configuration driven.
    grunt.initConfig({



        // Grunt 0.4 breaks from some older idioms. If we want a file,
        // read it in. I assume this is a synchronous file read.
        // If a key in the config does not define a task, it can be used
        // for arbitrary, and project-centric, configuration settings.
        pkg: grunt.file.readJSON('package.json'),
        
        // The meta section is an arbitrary section for holding commonly
        // shared things that I don't want to hardcode. Usage in grunt 0.4
        // seems relatively easy, example: '<%= meta.banner %>' will place the
        // banner string into some block of code.
        meta: {
            // Common file banner code.
            banner: ''+
                '/*!\n' +
                '    <%= pkg.title || pkg.name %>\n' +
                '    v<%= pkg.version %>\n' + 
                '    built <%= grunt.template.today("yyyy-mm-dd") %>\n' + 
                '    <%= pkg.homepage || "" %>\n' + 
                '    Copyright (c) <%= grunt.template.today("yyyy") %> <% pkg.author.name ? print(pkg.author.name+" <"+pkg.author.email+">") : print(pkg.author) %>\n' + 
                '    Licensed <%= pkg.license || _.pluck(pkg.licenses, "type").join(", ") %> \n' +
                ' */\n',
        },
        
        
        
        // Docs show possible more complex usage, but this is good enough.
        // This deletes things, be careful.
        clean: ["dist/"],
        
        
        
        // There are no longer vanilla tasks in grunt 0.4. All tasks are
        // run by plugins, including the vanilla tasks, like concat. 
        concat: {
            // It looks like in grunt 0.4 lots of plugs have an options block
            // for command-line-like options.
            options: {
                banner: '<%= meta.banner %>',
                // File separator. Historically defensive programming at it's
                // finest in JavaScript, since some odd bugs can occur due
                // to minifier programs snipping off trailing semicolons.
                separator: ';'
            },
            dist: {
                // Which files? Always an array, order is respected.
                // Glob expressions okay.
                src: ['lib/modernizr.js', 'lib/jquery.js', 'lib/morsecoder.js', 'src/**/*.js'],
                // This seems to be a change in grunt 0.4. Anywhere(?) a
                // string occurs, an underscore template replacement tag
                // can occur, and will be replaced. Here, output will
                // be the name of the package as found in the package.json
                // file and referenced in the pkg key created earlier in
                // this config.
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        
        
        // Move files from spot A to spot B
        copy: {
            main: {
                files: [
                    // includes files in path and its subdirs
                    {
                        // Wow, that was not intuitive. Here's what this 
                        // translates to in human language:
                        //     Copy from the static folder, but _don't_ copy
                        //     the static folder, and copy everything
                        //     relatively into the dist/ folder.
                        //     To prevent errors, or the treating of the
                        //     src patterns literally, we envoke expand to
                        //     expand the patterns as a list? Otherwise we
                        //     get errors.
                        src: ['**'],
                        cwd: "static",
                        expand: true,
                        dest: 'dist/',
                    },
                ]
            }
        },
        
        
        
        // Configuration for JSHint and the lint task.
        jshint: {
            // Which files should we lint?
            files: ['gruntfile.js', 'src/**/*.js'],
            // see 
            //     http://www.jshint.com/docs/
            // for a list of options
            options: {
                curly: true,
                eqeqeq: false,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                es5: true,
                devel: true,
                jquery: true,
                // Define globals here, with a true if they should be modifiable
                // and false if not. Use these for project globals that appear
                // everywhere and are assumed to be used everywhere.
                globals: {
                    module: false,
                    MorseCoder: false,
                    Modernizr: false,
                },
            },
        },
        
        
        // Qunit files are still run in phantomjs and are expected to be
        // full .html files.
        //qunit: {
        //    files: ['test/**/*.html']
        //},


        
        // Integrating stylus into grunt.
        stylus: {
            compile: {
                options: {
                    // use embedurl('test.png') in our code to trigger Data URI embedding
                    urlfunc: 'embedurl', 
                    // use stylus plugin at compile time
                    use: [
                        //require('fluidity'),
                    ],
                    // Don't minify
                    compress: false,
                },
                // What will be transpiled into CSS?
                files: {
                    // 1:1 compile
                    'dist/style.css': 'stylus/style.styl', 
                }
            },
        },
        
        
        
        // minification task.
        uglify: {
            options: {
                // Banner is now a separate option, and I don't have to deal
                // with the funky parsing of banners that I ran into in grunt
                // 0.3. YAY!
                //banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                banner: '<%= meta.banner %>',
            },
            dist: {
                files: {
                    // Looks like we can rereference any of the grunt config
                    // in string templates within our grunt config.
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },



        // The watch task should be called separately, as it can often be
        // a nuisance with all of the updates it can cause.
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'src/**/*.js', 'stylus/*.styl', 'static/**/*'],
                tasks: ['copy', 'jshint', 'concat', 'stylus'],
                options: {
                    debounceDelay: 250
                }
            }
        },
    });


    // All tasks must now be loaded explicitly.
    // Reminder: Simple tasks that are registered here can be run
    // from the commandline. For example, registering clean here
    // allows me to run the command:
    //
    //     grunt clean
    //
    // from the commandline.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');



    // default is what is run if we type just "grunt" from the commandline.
    // I tend to use default as a dev task.
    grunt.registerTask('default', ['copy', 'jshint', 'concat', 'stylus']);
    // I tend to make distribution of code not be implicit.
    grunt.registerTask('dist', ['clean', 'copy', 'jshint', 'concat', 'uglify', 'stylus']);
    // Simple, separate clean task.
    // Leaving this here as a lesson learned. registerTask registers alias
    // tasks. All configured tasks inside of grunt can technically be called.
    // Since 'clean' is a task, if I try to register it again, grunt barfs.
    // By default I can call it with "grunt clean".
    //grunt.registerTask('clean', ['clean']);
};
