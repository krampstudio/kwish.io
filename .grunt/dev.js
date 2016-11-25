/**
 * Development and preview mode
 *
 * grunt dev
 * grunt preview
 */
module.exports = function(grunt) {

    grunt.config.merge({
        connect: {
            preview: { },
            dev: {
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('preview', 'Preview the application', ['bundle', 'sass:compile', 'connect:preview:keepalive']);
    grunt.registerTask('dev',     'Run development mode',    ['connect:dev', 'watch']);
};
