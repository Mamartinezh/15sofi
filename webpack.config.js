
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')

const ruleForJS = {
	test: /\.js$/,
	loader: 'babel-loader',
	options: {
		presets: [
			[
				'@babel/preset-react',
				{runtime: 'automatic'}
			]
		]
	}
}

const ruleForCSS = {
	test: /\.css$/,
	use: ['style-loader', 'css-loader']
}

let ruleForMedia = {
	test: /\.(png|svg|webp|jpe?g|wav)$/,
	use: 'file-loader?name=./images/[name].[ext]'
}

ruleForMedia = 
{
      test: /\.(png|jpg|gif)$/i,
      type: "asset",
      parser: {
        dataUrlCondition: {
          maxSize: 8192
        }
      }
    }


const rules = [ ruleForJS, ruleForCSS, ruleForMedia ]

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build')
	},
	devtool: 'source-map',
	module: { rules },
	plugins: [
		new htmlWebpackPlugin({template: './src/index.html'}),
		new copyWebpackPlugin({patterns: [{from: path.resolve(__dirname, './static')}]})
	],
	devServer: {
		open: true,
		port: 3030,
		compress: true
	}
}