# You can make react, hapi, webpack project by cloning this code or typing following description

# React & Hapi 설치구성
## react.js + hapi.js + webpack 설치
참조링크: 
[Serving React and Flux with Hapi and Webpack](https://medium.com/@tribou/serving-react-and-flux-with-hapi-and-webpack-213afacf94ea#.tge2d3yiz)
[create-react-app 사용하기 + react-hot-loader 적용](https://velopert.com/2037)

### 1. PJT 초기화
```
npm init
```

### 2. Hapi, React 및 필요 모듈 설치
```
npm install --save hapi react react-dom flux hapi-react-views vision inert object-assign dateformat superagent babel-register babel-preset-es2015 babel-preset-react
```

### 3. 프로젝트 ROOT에 .babelrc file 작성 - Babel 6에서 필요
```javascript
{
  "presets": [
    "es2015",
    "react"
  ]
}
```

### 4. 프로젝트 ROOT에 index.js file 작성 - hapi 진입점
```javascript
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
```

### 5. “hot-loading” development environment (webpack & nodemon 모듈 설치)
```
npm install --save-dev nodemon webpack babel-core babel-loader
```

### 6. 프로젝트 ROOT에 nodemon.json file 생성
```javascript
{
  "restartable": "rs",
  "ignore": [
    ".git",
    "node_modules/**/node_modules",
    "assets/*"
  ],
  "ext": "js json jsx"
}
```

### 7. 프로젝트 ROOT에 webpack.config.js file 생성
```javascript
// Webpack config file
module.exports = {
  entry: './view/src/index.js',
  output: {
    path: __dirname + '/view/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};

- The entry  :  Webpack looks at the Index.jsx file to start bundling and tracing dependencies,
- The output  : defines the location of the bundled file, and
- The loaders  : it needs to process JSX file transformations with babel-loader.
```

### 8. 프로젝트 ROOT에 package.json file에 다음 script 추가
```javascript
"scripts": {
  "start": "node index.js",
  "build": "webpack -p --progress",
  "dev": "webpack --progress --color --watch & nodemon"
}
```

### 9. /view/public/index.html 작성
```html
<!DOCTYPE html>
<html>

   <head>
      <meta charset="UTF-8">
      <title>React App</title>
   </head>

   <body>
      <div id="root"></div>
      <script src="bundle.js"></script>
   </body>

</html>
```

### 10. jsx 파일 작성(확장자 js)

- /view/src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```

- /view/src/components/App.js
```javascript
import React from 'react';
 
class App extends React.Component {
    render(){
        return  (
            <div>
                Hello World!
            </div>
        );
    }
}
 
export default App;
```

### 11. 실행

- 개발 모드
```
npm run dev
```

- 배포 모드
```
npm run build
npm start
```
