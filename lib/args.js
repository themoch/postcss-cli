'use strict'
const chalk = require('chalk')

const logo = `
                                      /|\\
                                    //   //
                                  //       //
                                //___*___*___//
                              //--*---------*--//
                            /|| *             * ||/
                          // ||*               *|| //
                        //   || *             * ||   //
                      //_____||___*_________*___||_____//
`

const cli = require('../package.json').version
const version = chalk.bold.red(`
                                      /|\\
                                    //   //
                                  //       //
                                //___*___*___//
                              //--*---------*--//
                            /|| *             * ||/
                          // ||*    v${cli}     *|| //
                        //   || *             * ||   //
                      //_____||___*_________*___||_____//
`)

module.exports = require('yargs')
  .usage(
    `${chalk.bold.red(logo)}
Usage:
  $0 [input.css] [OPTIONS] [-o|--output output.css] [--watch|-w]
  $0 <input.css>... [OPTIONS] --dir <output-directory> [--watch|-w]
  $0 <input-directory> [OPTIONS] --dir <output-directory> [--watch|-w]
  $0 <input.css>... [OPTIONS] --replace`
  )
  .group(
    ['o', 'd', 'r', 'map', 'no-map', 'verbose', 'watch', 'env'],
    'Basic options:'
  )
  .option('o', {
    alias: 'output',
    desc: 'Output file',
    type: 'string',
    conflicts: ['dir', 'replace']
  })
  .option('d', {
    alias: 'dir',
    desc: 'Output directory',
    type: 'string',
    conflicts: ['output', 'replace']
  })
  .option('r', {
    alias: 'replace',
    desc: 'Replace (overwrite) the input file',
    type: 'boolean',
    // HACK: conflicts doesn't work with boolean opts correctly, so we do this
    // See https://github.com/yargs/yargs/issues/929
    coerce: v => v || undefined,
    conflicts: ['output', 'dir']
  })
  .alias('map', 'm')
  .describe('map', 'Create an external sourcemap')
  .describe('no-map', 'Disable the default inline sourcemaps')
  .option('verbose', {
    desc: 'Be verbose',
    type: 'boolean'
  })
  .option('watch', {
    alias: 'w',
    desc: 'Watch files for changes and recompile as needed',
    type: 'boolean',
    // HACK: conflicts doesn't work with boolean opts correctly, so we do this
    // See https://github.com/yargs/yargs/issues/929
    coerce: v => v || undefined,
    conflicts: 'replace'
  })
  .option('env', {
    desc: 'A shortcut for setting NODE_ENV',
    type: 'string'
  })
  .group(
    ['u', 'parser', 'stringifier', 'syntax'],
    'Options for when not using a config file:'
  )
  .option('u', {
    alias: 'use',
    desc: 'List of postcss plugins to use',
    type: 'array'
  })
  .option('parser', {
    desc: 'Custom postcss parser',
    type: 'string'
  })
  .option('stringifier', {
    desc: 'Custom postcss stringifier',
    type: 'string'
  })
  .option('syntax', {
    desc: 'Custom postcss syntax',
    type: 'string'
  })
  .group(['ext', 'base', 'poll', 'config'], 'Advanced options:')
  .option('ext', {
    desc: 'Override the output file extension; for use with --dir',
    type: 'string',
    implies: 'dir',
    coerce(ext) {
      if (ext.indexOf('.') !== 0) return `.${ext}`
      return ext
    }
  })
  .option('base', {
    desc:
      'Mirror the directory structure relative to this path in the output directory, for use with --dir',
    type: 'string',
    implies: 'dir'
  })
  .option('poll', {
    desc:
      'Use polling for file watching. Can optionally pass polling interval; default 100 ms',
    implies: 'watch'
  })
  .option('config', {
    desc: 'Set a custom path to look for a config file',
    type: 'string'
  })
  .version(version)
  .alias('h', 'help')
  .example('$0 input.css -o output.css', 'Basic usage')
  .example(
    'cat input.css | $0 -u autoprefixer > output.css',
    'Piping input & output'
  )
  .epilog(
    `If no input files are passed, it reads from stdin. If neither -o, --dir, or --replace is passed, it writes to stdout.

If there are multiple input files, the --dir or --replace option must be passed.

Input files may contain globs. If you pass an input directory, it will process all files in the directory and any subdirectories.

For more details, please see https://github.com/postcss/postcss-cli`
  ).argv
