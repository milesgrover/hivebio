module.exports = function (grunt) {
    "use strict";
    var path = require('path');
    var fs = require('fs');
    var pkg = grunt.file.readJSON('package.json');

    var paths = {
        dist: {
            root: './dist'
        },
        src: {
            root: './src'
        }
    };
    paths.dist.stylesheets              = paths.dist.root + '/stylesheets';
    paths.dist.scripts                  = paths.dist.root + '/scripts';
    paths.dist.iconFonts                = paths.dist.root + '/icon-fonts';
    paths.src.sass                      = paths.src.root + '/sass';
    paths.src.iconFonts                 = paths.src.root + '/icon-fonts';

    var files = {
        dev: {
            input: paths.src.sass + '/main.scss',
            output: paths.dist.stylesheets + '/HiveBio.dev.css'
        },
        prod: {
            input: paths.src.sass + '/main.scss',
            output: paths.dist.stylesheets + '/HiveBio.css'
        }
    };

    var HiveBioFiles = {};
    HiveBioFiles[files.dev.output] = files.dev.input;
    HiveBioFiles[files.prod.output] = files.prod.input;

    // Grunt Tasks
    grunt.initConfig({

        bump: {
            options: {
              files: ['package.json'],
              updateConfigs: [],
              commit: true,
              commitMessage: 'Release v%VERSION%',
              commitFiles: ['package.json'],
              createTag: true,
              tagName: 'v%VERSION%',
              tagMessage: 'Version %VERSION%',
              push: false,
              //pushTo: 'upstream',
              gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
              globalReplace: false,
              prereleaseName: false,
              regExp: false
            }
          },

        sass: {
            options: {
                sourceMap: false,
                outputStyle: 'nested', // nested, compressed
                includePaths: ['node_modules/bootstrap-sass/assets/stylesheets'],
                imagePath: '',
                precision: 10
            },
            dist: {
                files: HiveBioFiles
            }
        },
        cssmin: {
            files: [
                {
                    src: paths.dist.stylesheets + '/HiveBio.css',
                    dest: paths.dist.stylesheets + '/HiveBio.min.css'
                }
            ]
        },
        watch: {
            dev: {
                files: [paths.src.root + '/**'],
                tasks: ['sass', 'postcss', 'copy:html', 'copy:assets', 'bell']
            }
        },
        clean: {
            dist: [
                "./dist/"
            ]
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        browsers: ['> 1%']
                    }),
                    require('cssnano')()
                ]
            },
            dist: {
                src: 'dist/stylesheets/HiveBio.css'
            }
        },
        copy: {
            assets: {
                files: [
                    {expand: true, flatten: true, src: ['src/HTML/assets/**'], dest: 'dist/assets/'}
                ]
            },
            html: {
                files: [
                    {expand: true, flatten: true, src: ['src/HTML/**/*.html'], dest: 'dist/'}
                ]
            }
        }
    });


    // Load grunt plugins
    grunt.loadNpmTasks('grunt-bell');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');

    // Register default task
    grunt.registerTask('default', ['build']);

    // build tasks: default builds dev files, prod builds everything for production, justjs quickly builds JS changes
    grunt.registerTask('build', ['clean:dist', 'sass', 'postcss', 'copy:html', 'copy:assets', 'bell']);

}
