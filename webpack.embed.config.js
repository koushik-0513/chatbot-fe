const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/widget/embed-script.ts',
  output: {
    path: path.resolve(__dirname, 'dist/widget'),
    filename: 'chatbot-embed.js',
    library: 'ChatbotEmbed',
    libraryTarget: 'umd',
    globalObject: 'this',
    clean: false, // Don't clean since we're building multiple files
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: [],
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  optimization: {
    minimize: true,
  },
};
