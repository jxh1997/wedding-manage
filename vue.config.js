
const TerserPlugin = require('terser-webpack-plugin')  // 用于在生成环境剔除debuger和console
const CompressionPlugin = require("compression-webpack-plugin"); // gzip压缩,优化http请求,提高加载速度
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 代码分析工具 
const path = require('path');
const resolve = dir => {
  return path.join(__dirname, dir);
};

const env = process.env.NODE_ENV
let target = process.env.VUE_APP_URL  // development和production环境是不同的

const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [
    ]
  },
  // 生产环境
  build: {
    css: [
      'https://cdn.bootcss.com/element-ui/2.11.1/theme-chalk/index.css',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
    ],
    js: [
      'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
      'https://cdn.bootcss.com/vue-router/3.1.2/vue-router.min.js',
      'https://cdn.bootcss.com/vuex/2.3.1/vuex.min.js',
      'https://cdn.bootcss.com/axios/0.19.0/axios.min.js',
      'https://cdn.bootcss.com/vue-i18n/8.13.0/vue-i18n.min.js',
      'https://cdn.bootcss.com/element-ui/2.11.1/index.js',
      'https://cdn.bootcss.com/echarts/3.8.5/echarts.min.js',
      'https://cdn.bootcss.com/Mock.js/1.0.1-beta3/mock-min.js',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js',
      'https://cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js'
    ]
  }
}


module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/permission/" : "/",
  outputDir: './dist',
  assetsDir: 'static',
  filenameHashing: true, // false 来关闭文件名哈希
  lintOnSave: false, // 关闭eslint
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8808,
    // 跨域配置
    proxy: {
      '/test': {
        target: 'http://152.136.229.70:8011/test',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/test': ''
        }
      }
    }
  },
}

