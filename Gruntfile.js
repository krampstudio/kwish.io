module.exports = function(grunt) {
    'use strict';

    var layout = {
        src : {
            server : ['lib/**/*.js', 'controllers/*.js', 'app.js'],
            client : ['public/js/**/*.js', '!public/js/test/**/*.js']
        },
        test : {
            server : ['test/**/*_test.js'],
            client : ['public/js/test/**/*.js']
        },
        lib : {
            client : 'public/lib/'
        },
        build: 'build/',
        logs: 'logs/'
    };

    //display times
    require('time-grunt')(grunt);

    //load npm tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        config : grunt.file.readJSON('config/config.json'),

        mkdir: {
            install: {
                options: {
                    create: [layout.build, layout.logs]
                }
            }
        },

        clean : {
            install: [layout.build, layout.logs, layout.lib.client]
        },

        copy : {
            install: {
                files : [
                    { src : 'config/config.json', dest: 'config/.config.json.backup' },
                    { src : 'config/config.json.sample', dest: 'config/config.json' }
                ]
            }
        },

        jsdoc: {
            server: {
                src: layout.src.server,
                options: {
                    destination: layout.build + 'doc/server'
                }
            },
            client: {
                src: layout.src.client,
                options: {
                    destination: layout.build + 'doc/server'
                }
            }
        },

        nodeunit: {
            unit: {
                src: layout.test.server
            }
        },

        jshint: {
            server : {
                src: layout.src.server.concat(layout.test.server).concat(['Gruntfile.js']),
                options : {
                    jshintrc : '.jshintrc'
                }
            },
            client : {
                src: layout.src.client.concat(layout.test.client),
                options : {
                    jshintrc : 'public/js/.jshintrc'
                }
            }
        },

        bower : {
            install :  {
                options: {
                    targetDir: layout.lib.client,
                    copy: true,
                    cleanup: true
                }
            }
        },

        sass : {
            build: {
                options : {
                    outputStyle: 'compressed'
                },
                files : {
                    'public/css/main.css' : [ 'public/scss/main.scss' ]
                }
            },

            preview: {
                options : {
                    lineNumbers : true
                },
                files : {
                    'public/css/main.css' : [ 'public/scss/main.scss' ]
                }
            }
        },

        requirejs : {
            build : {
                options : {
                    baseUrl : "public/js",
                    mainConfigFile : 'public/js/config.js',
                    optimize : 'uglify2',
                    generateSourceMaps: true,
                    preserveLicenseComments : false,
                    findNestedDependencies : true,
                    name : 'app',
                    include : ['../lib/requirejs/require'],
                    out : 'public/js/app.min.js'
                }
            }
        },

        watch: {
            options: {
                debounceDelay: 5000
            },
            sass: {
                files: ['public/scss/*.scss'],
                tasks : ['sass:preview']
            },
            requirejs : {
                files: ['public/js/*.js', 'public/js/components/*.js', 'public/js/components/core/*.js'],
                tasks : ['requirejs:build']
            }
        },

        nodemon : {
            preview  : {
                script : 'app.js',
                options : {
                    watch  : ['app.js', 'lib/**/*.js', 'controllers/**/*.js', 'config/**/*.js'],
                    nodeArgs: ['--debug']
                }
            }
        },

        'node-inspector': {
            preview: {
                options: {
                  'hidden': ['node_modules']
                }
            }
        },
        concurrent: {
            preview: {
                tasks: ['nodemon:preview', 'node-inspector', 'watch:sass', 'watch:requirejs'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
    });

    grunt.registerTask('preparetest', 'Load integration test data', function integrationTest(){
        var prepare = require('./test/data/prepare');
        var done = this.async();

        prepare.run(function(err){
            if(err){
                return grunt.fail.warn(err);
            }
            done();
        });
    });

    // Tasks flow.
    grunt.registerTask('install',   "Prepare project",      ['clean:install', 'mkdir:install', 'bower:install', 'copy:install']);
    grunt.registerTask('test',      "Run unit tests",       ['preparetest' ,'nodeunit']);
    grunt.registerTask('build',     "Build the project",    ['jshint', 'test', 'jsdoc', 'sassi:build', 'requirejs']);
    grunt.registerTask('preview',   "Run preview server",   ['concurrent:preview']);
};
