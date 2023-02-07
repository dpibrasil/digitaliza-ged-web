const OfflinePlugin = require('offline-plugin');

module.exports = {
  // ...
  plugins: [
    new OfflinePlugin({
      appShell: '/',
      caches: 'all',
      ServiceWorker: {
        events: true
      },
      externals: ['/']
    })
  ]
};
