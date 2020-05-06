const path = require('path')

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  publicPath: './',
  // 代理配置
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    // https: false, // 是否使用https
    // open: true,// 是否自动打开浏览器
    proxy: {
      // 正式接口代理地址
      '/dev': {
        target: 'http://47.110.145.22/drop/restful',
        ws: true,
        changeOrigin: true,
        // 用/api代替target里面的请求
        pathRewrite: {
          '^/dev': ''
        }
      },
      '/test': {
        target: 'http://192.168.0.106:8122/drop',
        // target: 'http://192.168.0.106:8122/drop/machine/fetchMachineType',
        ws: true,
        changeOrigin: true,
        // 用/api代替target里面的请求
        pathRewrite: {
          '^/test': ''
        }
      },
    }
  },

  // webpack配置 哈哈哈
  configureWebpack: {
    externals: {
      "vue": "Vue",
      "vue-router": "VueRouter",
      "vuex": "Vuex",
      // "element-ui": "ElementUI",
      "axios": "axios",
    },
    resolve: {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        // 重新设置 alias,扩展项目路径别名
        '@': path.resolve(__dirname, './src'),
        '@api': path.resolve(__dirname, './src/apis/api.js'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@comp': path.resolve(__dirname, './src/components'),
        '@imgs': path.resolve(__dirname, './src/assets/imgs'),
        '@plug': path.resolve(__dirname, './src/plugins'),
        '@utils': path.resolve(__dirname, './src/utils')
      }
    },
  }
}