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
        volatile : [ this.build]
    };

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
                    node : true
                }
            },
            client : {
                src: layout.src.client.concat(layout.test.client),
                options : {
                    browser : true
                }
            },
            options: {
                camelcase: true,
                smarttabs: true,
                curly: true,
                multistr: true
            }
        },

        //the components will be copied regarding the .bowerrc file
        bower : {
            install :  {
                options : {
                    targetDir : layout.build + 'tmp/components'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-task');


    // Tasks flow.
    grunt.registerTask('install', ['clean', 'mkdir', 'bower']);
    grunt.registerTask('test', ['nodeunit']);
    grunt.registerTask('build', ['jshint', 'test', 'jsdoc']);
};
