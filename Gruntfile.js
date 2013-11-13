module.exports = function(grunt) {
    'use strict';

    var layout = {
        src : {
            server : ['lib/**/*.js', 'controllers/*.js', 'app.js'],
            client : ['public/js/**/*.js', '!public/js/test/**/*.js']
        },
        test : {
            server : ['test/**/*.js'],
            client : ['public/js/test/**/*.js']
        },
        build: 'build/',
        volatile : ['build']
    };

    //display times
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),        
        
        mkdir: {
            install: {
                options: {
                    create: layout.volatile
                }
            }
        },
        
        clean : {
            install: layout.volatile,
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
                targetDir: 'public/js/lib'
            }
        },
        
        compass : {
            options : {
                require: 'susy',
                sassDir: 'public/sass',
                cssDIr: 'public/css'
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
    

    // Tasks flow.
    grunt.registerTask('install', ['clean', 'mkdir', 'bower']);
    grunt.registerTask('test', ['nodeunit']);
    grunt.registerTask('build', ['jshint', 'test', 'jsdoc']);
};
