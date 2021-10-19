const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir)
}
/** 标准横幅 **/
const package = require('./package.json')
const banner = `${package.name} v${package.version}
(c) 2021-${new Date().getFullYear()} entfrm开发团队-王翔
Released under the MIT License`

module.exports =  {

  productionSourceMap: false,

  chainWebpack: (config) => {

    config.externals({
      'vue': 'Vue',
      'element-ui': 'ELEMENT'
    })

    config.resolve.alias
      .set('@', resolve('packages'))
      .set('@components', resolve('packages/components'))
      .set('@utils', resolve('packages/utils'))
      .set('@mixins', resolve('packages/mixins'))

    config.plugin('banner')
      .use(require('webpack').BannerPlugin, [banner])
  },

  devServer: {
    host: '0.0.0.0',
    port: 80,
    open: true,
    disableHostCheck: true
  },

  css: {
    // 阅读@vue/cli-service源码发现内部使用了mini-css-extract-plugin插件做css分离
    // 考虑方便性决定,关闭css分离插件
    extract: false
  }
}
