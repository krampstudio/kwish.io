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

        compass : {
            compile: { },
            watch : {
                options: {
                    watch : true
                }
            },
            options : {
                require: 'zen-grids',
                basePath: 'public',
                sassDir: 'sass',
                cssDir: 'css'
            }
        },

        sass : {
            build: {
                options : {
                    sourceMap : true,
                    outputStyle: 'compressed'
                },
                files : {
                    'public/css/main.css' : [ 'public/scss/main.scss' ]
                }
            },

            preview: {
                files : {
                    'public/css/main.css' : [ 'public/scss/main.scss' ]
                }
            }
        },

        watch: {
            options: {
                livereload: 35729,
                debounceDelay: 200
            },
            sass: {
                files: ['public/**/*.scss'],
                tasks : ['sass:preview']
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
                tasks: ['nodemon:preview', 'node-inspector', 'watch:sass'],
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
    grunt.registerTask('build',     "Build the project",    ['jshint', 'test', 'jsdoc']);
    grunt.registerTask('preview',   "Run preview server",   ['concurrent:preview']);
};
