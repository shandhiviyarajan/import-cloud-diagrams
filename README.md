# Hava Viewer

The Hava Viewer is a Javascript component responsible for displaying our environments within the browser. It renders the various views that we support across a variety of different canvases and allows the user to interact with each resource to diagnose different attributes of the resources configuration.

All the code that makes our designs pretty and usable - it's an angular directive that, given some design JSON, can be embedded and used in the app.

Repository: https://github.com/vibrato/hava-viewer.git

Technical Info:
* JavaScript
* Angular 1.7
* JointJS

## Getting Started

Assuming that you have NodeJS installed you simply need to install dependencies and then run gulp to run the application.

    yarn install
    yarn gulp

You should now be able to view the application on http://localhost:9704

## Builds

To create a build of hava-viewer run the following command

    export NODE_ENV=prod && yarn gulp build

This kicks off a process of SCSS compilation and file concatenation to produce our JavaScript & CSS artifacts.

- Combines all `\*.js` files from the `src/` directory into `dist/hava.designer.js`
- Combines all `\*.html` files from the `src/` directory into `dist/hava.designer.templates.js`
- Combines all JS included from `vendor.js` into `dist/hava.designer.vendor.js`
- Compiles all SCSS included from `src/designer.scss` into `dist/hava.designer.css`

