/**
 * Client side source bundling
 *
 * grunt bundle
 * grunt watch:bundle
 */
module.exports = function(grunt) {

    var banner = '/* <%= pkg.name %> - <%= pkg.version %>\n'  +
                 ' * © <%= grunt.template.today("yyyy") %>\n' +
                 ' * @author <%= pkg.author %>\n' +
                 ' * @lisence <%= pkg.license %>\n' +
                 ' */';


    grunt.config.merge({

        browserify: {
            bundle: {
                files: [{
                    src : ['public/js/src/main.js'],
                    dest : 'public/js/bundle.js'
                }]
            }
        },

        exorcise: {
            bundle: {
                files: [{
                    src : ['public/js/bundle.js'],
                    dest : 'public/js/bundle.js.map'
                }]
            }
        },

        uglify: {
            bundle: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: 'public/js/bundle.js.map',
                    banner: banner
                },
                files: [{
                    src  : ['public/js/bundle.js'],
                    dest : 'public/js/bundle.min.js'
                }]
            }
        },

        clean: {
            bundle: {
                files: [{
                    expand: true,
                    cwd: 'public/js',
                    src: ['bundle.js*']
                }]
            }
        },


        watch: {
            bundle: {
                files: ['public/js/src/**/*.js'],
                tasks: ['bundle'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('bundle', 'Compile client side code', ['browserify:bundle', 'exorcise:bundle', 'uglify:bundle', 'clean:bundle']);
};
