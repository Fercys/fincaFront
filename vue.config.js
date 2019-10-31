module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/frontend/'
    : '/',
  devServer: {
    //open: process.platform === 'linux',
    host: '0.0.0.0',
    port: 8080,
    https: true,
    hotOnly: false,
    publicPath:  '/'
  }  
}