export default {
  base: '',
  build: {
      target: 'esnext' //browsers can handle the latest ES features
    },
  pages: {
    index: {
      entry: './src/main.js',
      template: './index.html',
      title: 'mixtape'
    },
    privacy: {
      entry: './src/main.js',
      template: './privacy.html',
      title: 'Privacy'
    }
  }
  }