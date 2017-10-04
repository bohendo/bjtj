
# React

## Key Resources
 - [React Environment Setup](https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel)
 - [React Tutorial](https://facebook.github.io/react/tutorial/tutorial.html)
 - [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html)

## Environment Setup

### The Easy Way

There is a really fantastic [create-react-app](https://github.com/facebookincubator/create-react-app) utility that will take care of all the environment setup for you. All you need to do is run the following few lines of code and you're ready to go.

```bash
npm install -g create-react-app
create-react-app my-app
cd my-app/
npm start
# Now your app is live on localhost:3000
```

### The Hard Way

React is a super popular frontend framework but the environment setup is notoriously unfriendly for beginners. The above tool is a great shortcut but lets dive in a little deeper and actually setup an environment from scratch. This will show us how things work under the hood and help us debug more intelligently even if we end up using the create-react-app tool.

```bash
# Let's create an empty project
mkdir blog && cd blog

# -y for yes aka say yes to all default prompts
npm init -y
```

#### [Babel](https://babeljs.io/)

Babel lets us use modern dialects of javascript even in old-fashion browsers. I love arrow functions so I'll use babel to compile my ES15 code into older versions of JS that all browsers will understand. I'll also use Babel to take advantage of the beautiful JSX syntax. Although React has a `React.createElement()` method for defining the DOM with traditional JS, JSX is an HTML-JS hybrid that makes defining the DOM far more readable. I love JSX so I'll also be using babel to compile JSX syntax into vanilla JS.

```bash
# Install the babel modules we want
npm install --save-dev babel-core babel-preset-es2015 babel-preset-react babel-loader

# Create a super simple configuration file
echo "{ presets: [ 'es2015', 'react' ] }" > .babelrc
```

We won't be dealing with babel directly though, we'll let webpack take care of it.

#### [Webpack](https://webpack.js.org/concepts/)

Webpack is a tool that packages your application's client-side code and all dependencies into one js bundle. It's configuration revolves around 4 core concepts:

 - [Entry](https://webpack.js.org/concepts/entry-points/): Webpack starts by building a graph of all our app's dependencies starting at some entry. This entry point is the file that kicks off our application, it's dependencies are the first layer added to the dependency graph then their dependencies are added and so on.
 - [Output](https://webpack.js.org/concepts/output/): This property tells us what to do with our bundled code. For example, what to name it and where to save it.
 - [Loaders](https://webpack.js.org/concepts/loaders/): File transformations. Webpack treats all files (css, html, js, etc) as modules but it only understands js. Loaders let us package non-js files into modules (ie lets us import css directly within a js module) and to pre-process files as we load them (ie compile LESS into CSS).
 - [Plugins](https://webpack.js.org/concepts/plugins/): Similar to but more powerful than loaders; while loaders operate on one file at a time, plugins let us act on groups of files. In the example below, we'll use an html plugin that generates an html file with the appropriate webpack bundles automatically included.

```bash
# install webpack, a dev server, and a useful util
npm install --save webpack html-webpack-plugin path

vim webpack.config.js
```

```javascript
const path = require('path');
const htmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve('static'),
    filename: 'index.js'
  },
  module: {
    loaders: [
      { test: /.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
    ]
  },
  plugins: [
    new htmlPlugin({ template: './client/index.html', filename: 'index.html', inject: 'body' })
  ],
  node: {
    fs: 'empty'
  }
};

```

#### React

```bash
// install react core
npm install --save react react-dom

mkdir client
vim client/index.html
```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>React App Setup</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

```bash
vim client/index.js
```

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
     <div style={{textAlign: 'center'}}>
        <h1>Hello World</h1>
      </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
```

```bash
vim server.js
```

```javascript
const http = require('http');
const fs   = require('fs');

http.createServer((request, response) => {

  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });

  response.on('error', (err) => {
    console.error(err);
  });

  if (request.url === '/') {
    response.end(fs.readFileSync('static/index.html', {encoding: 'utf8'}));
  } else {
    response.end(fs.readFileSync('static' + request.url, {encoding: 'utf8'}));
  }


}).listen(3000);
```

```bash
# Build our webpack
./node_modules/webpack/bin/webpack.js webpack.config.js

# And start our server. Congrats, your react app is live!
node server.js
```

## React Core Concepts

### Components

An element is the smallest building block of your frontend & is immutable; like a single frame in a movie.

A components is a pure function that accepts a `props` object as input and returns exactly one element (so `<div><h1>Wow</h1><h2>man</h2></div>` is valid but `<h1>Wow</h1><h2>man</h2>` is not). Component names are used to define custom DOM tags, they should start with a capital letter to distinguish them from vanilla DOM tags.

Components can also be defined as a class that inherits React.Component & defines a render method which returns an element. Component classes have more features than functions, use these especially where you need to utilize some state. Component classes can have 'lifecycle hooks' aka methods that are automatically called when the component is mounted or unmounted (mounting a component means rendering it for the first time, unmounting it is removing it from the DOM).

### State

Don't use state in static views. State is reserved solely for interactivity. Keep state absolutely minimal & DRY. Identifying where the state should live is one of the biggest challenges for newcomers, be careful. State should probably live at it's dependencies' lowest common ancestor. Maybe one level up, maybe create a dedicated component.

Do not modify the state directly with assignments. Always use the `this.setState({key: value})` pattern. `setState()` can be given the updated state as an object or a function of the previous state and props which returns the updated state. The output of setState() is **merged** with the current state rather than replacing it.


