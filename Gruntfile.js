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

    // Project configuration.
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),        
        
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
        }

    });
    
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    
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
    grunt.registerTask('install', ['clean', 'mkdir', 'bower']);
    grunt.registerTask('test', ['preparetest' ,'nodeunit']);
    grunt.registerTask('build', ['jshint', 'test', 'jsdoc']);
};
