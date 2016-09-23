// Create a basic Hapi.js server
require('babel-register')({
  presets: ['es2015', 'react'],
});
var Hapi = require('hapi');
var dateFormat = require('dateformat');
var format = "dd mmm HH:MM:ss";

// Basic Hapi.js connection stuff
var server = new Hapi.Server();
server.connection({port: 8081});

// Register the inert and vision Hapi plugins
// As of Hapi 9.x, these two plugins are no longer
// included in Hapi automatically
// https://github.com/hapijs/hapi/issues/2682
server.register([{
  register: require('inert')
}, {
  register: require('vision')
}], function(err) {
  if (err) return console.error(err);
  
  // Add the React-rendering view engine
  server.views({
    engines: {
      jsx: require('hapi-react-views')
    },
    relativeTo: __dirname,
    path: 'view'
  });

  // 정적 resource load
  server.route({
    method: 'GET',
    path: '/{filename*}',
    handler: {
      directory: {
        path:    './view/public', // 현재 Hapi가 구동하는 index.js 경로 기준
        index: ['index.html']
        // listing: false,
        // index:   false
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    /*
    handler: function(request, reply){
        reply.file('/public/index.html');
    }
    */
    handler: {
        file: './view/public/index.html'
    }
  });

  /* -jsx 직접 load
  // Add main app route
  server.route({
    method: 'GET',
    path: '/',
    handler: {
      view: './src/components/App'
    }
  });
  */    
    
    
  server.start(function() {
    console.log(dateFormat(new Date(), format) + ' - Server started at: ' + server.info.uri);
  });

});