'use strict'
const pkg = require('../package')

module.exports = {
  port: 4002,
  title: '持续集成平台',
  // when you use electron please set to relative path like ./
  // otherwise only set to absolute path when you're using history mode
  publicPath: '/ops/',
  // add these dependencies to a standalone vendor bundle
  vendor: [
    'vue',
    'vuex',
    'vue-router',
    'vuex-router-sync',
    'promise-polyfill'
  ],
  // disable babelrc by default
  babel: {
    babelrc: false,
    presets: [
      ['es2015', {modules: false}],
      'stage-1',
    ],
    // support jsx in render function
    plugins: [
      'transform-vue-jsx',
      'transform-runtime'
    ]
  },
  postcss: [
    // add prefix via postcss since it's faster
    require('autoprefixer')({
      // Vue does not support ie 8 and below
      browsers: [          
        'ie >= 8',
        'ie_mob >= 10',
        'ff >= 26',
        'chrome >= 30',
        'safari >= 6',
        'opera >= 23',
        'ios >= 5',
        'android >= 2.3',
        'bb >= 10'
      ]
    }),
    require('postcss-nested')
  ],
  cssModules: false,
}
