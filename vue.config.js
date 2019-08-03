const isProductMode = ['production', 'prod'].includes(process.env.NODE_ENV);

const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

// CDN 引入
const cdn = {
  // 开发环境
  dev: {
    css: [
    ],
    js: [
			// 'https://res2.wx.qq.com/open/js/jweixin-1.4.0.js' // wechat jssdk
		]
	},

  // 生产环境
  build: {
    css: [
    ],
    js: [
			// 'https://res2.wx.qq.com/open/js/jweixin-1.4.0.js', // wechat jssdk
			// 'https://unpkg.com/echarts@4.2.1-rc.2/dist/echarts.min.js' // echarts
      'https://cdn.jsdelivr.net/npm/vue@2.6.6/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js'
    ]
  }
}

// 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
const externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'axios': 'axios'
}

let _exports = {
	// 部署应用包时的基本 URL
	publicPath: process.env.NODE_ENV === 'production'
	? '/h5_single/'
	: '/',

	// 生产环境构建文件的目录
	outputDir: 'h5_single',

	// 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
	assetsDir: '',

	// 指定生成的 index.html 的输出路径 (相对于 outputDir)
	indexPath: 'index.html', 

	// 用于多页配置
	pages: undefined,

	// 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
	lintOnSave: true,

	// 是否使用包含运行时编译器的 Vue 构建版本
	runtimeCompiler: false,

	// 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。
	// 如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
	transpileDependencies: [],

	// 不需要生产环境的 source map
	productionSourceMap: false,

	// 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性
	crossorigin: undefined,

	// 是否为 Babel 或 TypeScript 使用 thread-loader。
	// 该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
	parallel: require('os').cpus().length > 1,

	// 向 PWA 插件传递选项
	pwa: {},

	// 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
	// 如果这个值是一个函数，则会接收被解析的配置作为参数。
	// 该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
	configureWebpack: config => {
		if (isProductMode) {
			const plugins = []
			plugins.push(
				new UglifyJsPlugin({
					uglifyOptions: {
						compress: {
							// warnings: false,
							drop_console: true,
							drop_debugger: true,
							pure_funcs: ['console.log'] // 移除console
						},
						mangle: false,
						output: {
							beautify: true,// 压缩注释
						}
					},
					sourceMap: false,
					parallel: true,
				})
			)
			plugins.push(
				new CompressionWebpackPlugin({
					filename: '[path].gz[query]',
					algorithm: 'gzip',
					test: productionGzipExtensions,
					threshold: 10240,
					minRatio: 0.8
				})
			);
			config.plugins = [...config.plugins, ...plugins]

			// 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
			config.externals = externals
		}
	},

	// 接收一个基于 webpack-chain 的 ChainableConfig 实例。
	// 允许对内部的 webpack 配置进行更细粒度的修改
	// 添加、修改 Loader 选项
	chainWebpack: config => {
		// 修复HMR
		config
			.resolve
			.symlinks(true);

		if (isProductMode) {
			// 打包分析
			config
				.plugin('webpack-bundle-analyzer')
				.use(BundleAnalyzerPlugin);
		};

		// 修复 Lazy loading routes Error
		config
			.plugin('html')
			.tap(args => {
				args[0].chunksSortMode = 'none';
				return args;
		});

		/**
     * 添加CDN参数到htmlWebpackPlugin配置中
		 * 修复 Lazy loading routes Error
     */
		config
      .plugin('html')
      .tap(args => {
				// 修复 Lazy loading routes Error
				args[0].chunksSortMode = 'none';

				/**
				 * 添加CDN参数到htmlWebpackPlugin配置中
				 */
        if (isProductMode) {
          args[0].cdn = cdn.build
        } else {
          args[0].cdn = cdn.dev
				}
        return args
      });

		// 添加别名
		config
			.resolve
			.alias
			.set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
			.set('@components', resolve('src/components'))
      .set('@interface', resolve('src/interface'))
			.set('@libs', resolve('src/libs'))
			.set('@plugin', resolve('src/plugin'))
			.set('@router', resolve('src/router'))
      .set('@store', resolve('src/store'))
      .set('@styles', resolve('src/styles'))
			.set('@utils', resolve('src/utils'))
			.set('@views', resolve('src/views'));

		// 压缩图片
		config.module
			.rule("images")
			.use("image-webpack-loader")
			.loader("image-webpack-loader")
			.options({
				mozjpeg: {progressive: true, quality: 65},
				optipng: {enabled: false},
				pngquant: {quality: "65-90", speed: 4},
				gifsicle: {interlaced: false},
				webp: {quality: 75}
			});
			
		/**
     * 无需使用@import在每个scss文件中引入变量或者mixin，也可以避免大量@import导致build变慢
     * sass-resources-loader 文档链接：https://github.com/shakacode/sass-resources-loader
     */
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    const sassResources = ['reset.scss', 'mixin.scss', 'common.scss'] // scss资源文件，可以在里面定义变量，mixin,全局混入样式等
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: sassResources.map(file => path.resolve(__dirname, 'src/styles/' + file))
        })
        .end()
    })
	},

	css: {
		/**
		 * 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
		 * 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
		 */
		// extract: true, // 需要注释掉否则修改css样式不会热更新

		// 是否开启 CSS source map？
		sourceMap: true,

		/**
		 * 为预处理器的 loader 传递自定义选项。比如传递给
		 * sass-loader 时，使用 `{ sass: { ... } }`。
		 */
		loaderOptions: {},

		// 为所有的 CSS 及其预处理文件开启 CSS Modules。
		// 这个选项不会影响 `*.vue` 文件。
		modules: false
	},

	// 这是一个不进行任何 schema 验证的对象，因此它可以用来传递任何第三方插件选项
	pluginOptions: {},

	// webpack-dev-server 相关配置
	devServer: {
		// overlay: {
		//   warnings: true,
		//   errors: true
		// }, // 浏览器 overlay 显示警告和错误
		open: false,
		host: '0.0.0.0',
		port: 8080,
		progress: true,
		https: false,
		hot: true,
		hotOnly: true,
		proxy: null
	}
};

module.exports = _exports;
