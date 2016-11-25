/**
 * Sass compilation tasks
 *
 * grunt sass:compile
 * grunt watch:sass
 */
module.exports = function(grunt) {

    grunt.config.merge({
        sass :  {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            compile: {
                files : [{
                    dest: 'public/css/main.css',
                    src : 'public/scss/main.scss'
                }]
            }
        },
        watch: {
            sass: {
                files: ['public/scss/**/*.scss'],
                tasks: ['sass:compile'],
                options: {
                    livereload: true
                }
            }
        }
    });
};
