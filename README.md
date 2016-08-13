# Aurelia installer

The missing brother of [Aurelia CLI](https://github.com/aurelia/cli)

- Create, install and manage components as application entities
- Automatically configure vendor and 3rd party libraries
- Install Aurelia plugins by name

All automated for your pleasure! 

## Install

`npm i aurelia-installer -g`

## Usage

- `init` initialize your project for better `ai` experience (optional) 

*Component*
- `create` create a new component folder
- `install` install/mount from git repo
- `uninstall` install/unmount
- `bundle` bundle component with app
- `unbundle` unbundle componen from app
- use it!

*Vendor library*
- `bundle` bundle a vendor library (TODO: also install typings if available!)
- `bundle :list` list all registered vendor libs
- `unbundle` unbundle a vendor lib (TODO)

*Plugin*
- `plugin` install and configure a plugin
- `plugin :list` list all registered plugins

*Typings*
- `typings` install typings for a vendor lib
- `typings :list` list all registered typings 

*App layout*
- `ai app` - create main app src layout  
- `ai app layout` - add additional app with own src layout 

*Coming soon* Installer commands will effect only in current/designated app when you have multiple sub-apps!

## Init

We recommend that you first run `ai init` to initialize your installer preferences (stored in `installer.json`).

- App bundle manager (webpack or systemjs)
- Dependency module manager (npm or jspm)
- Default Git account
- Default components path

## App config and layouts

You can install an app layout:
- `multi`
- `advanced`
- `simple`

Note: Feel free to contribute your own favorite app layouts!

### App config

`ai app`

Lets you define app layout preferences:
- src layout
- default app layout

- generates main app `/src` layout (`multi`, `simple` or `advanced`)

### Generating app layouts

- `app layout <name> <laout name>` - add an app with a src layout

Examples:

- `app layout guest` - create default app layout for `guest` app
- `app layout login simple` - create `simple` app layout for `login`

### Select app to work on

Switch which application you are working on:

- `app switch <name>` - switch to work with selected app
- `app switch :root` - switch to src root

This will effect where components are created, mounted and unmounted   

## Components

A component is an application entity. Typically it consists of at least a *ViewModel* with an optional *View* associated.
The component can also have dependencies to external modules and 3rd party libraries.

Components are meant as a larger entities than elements, which are primitives, like molecule vs. atom.
A component can contain other components and use elements! Each component lives in its own folder for clean separation.

Please see [how to structure an aurelia application](http://ilikekillnerds.com/2015/10/how-to-structure-an-aurelia-application/)

Components can be globalised for use as a custom element, by calling `globalResources` in your features `index.js`  

```js
export function configure(config) {
  config.globalResources('markdown/markdown', './disco-light', .. );
}
```

See [making custom element global](http://drdwilcox.blogspot.dk/2015/12/aurelia-making-custom-element-global.html)

You can then use: `.feature('components');` from your `main.js` file to continue configuration in your `components/index.js` file. 

### Mounting components

You can mount components directly into your application on a given mount path which often coresponds closely to a route.
Unmounted components by convention live in `src/components`.

### Component management

`aurelia-installer` can manage the *creation*, *installation* and application *bundling* of such components!
The installe keeps track of your components in `installer.json`.
This registry is used to later *uninstall* a component by name if needed. 

### Sample component

[contact-detail](https://github.com/kristianmandrup/contact-detail) is a sample component

Sample *install.json*

```json
{
  "bundles": [
    "foundation"
  ],
  "dependencies": [
    "jquery",
    {
      "name": "bootstrap",
      "path": "../node_modules/bootstrap/dist",
      "main": "js/bootstrap.min",
      "deps": ["jquery"],
      "exports": "$",
      "resources": [
        "css/bootstrap.css"
      ]
    }
  ],
  "typings": [
    "nprogress"
  ]
}
```

*Unmounted component example*

Unmounted components are by default installed under `src/components`. 
This is sensible for general purpose components such as 'large-modal` that are reused in multiple parts of your app.

```bash
src/components/large-modal
  index.html
  index.js
  package.json
  install.json
```

We use the `index` convention to signify the main entry point of the component. 

*Mounted under contacts*

Components specific to a particular domain should be mounted in that domain, such as `contacts`

```bash
src/contacts/contact-detail
  index.html
  index.js
  package.json
  install.json
```

### Install component from repo

Downloads a component from a git repo and copies it to your project

`ai install kristianmandrup/contact-detail`

Repo formats available see [here](https://www.npmjs.com/package/download-git-repo)

- GitHub: github:owner/name or simply owner/name
- GitLab: gitlab:owner/name
- Bitbucket: bitbucket:owner/name

If you have run `ai init` and set a default git account, it will use that.
This means you can just write the name of your component repo to install it! 

`ai install contact-detail`

After installing a component you need to bundle it with the app.

### Bundle component(s)

`ai bundle` (all) or `ai bundle contact-detail`

This will merge the component dependencies with app dependencies in a crafty manner, almost like if you had done it by hand.
It will also install any typings defined.

### Uninstall

`ai uninstall contact-detail`

Removes the component from your app! Also (optionally) removes bundled component dependencies.

## Bundle vendor library

`ai vendor :list` - to list registered vendor bundles

`ai vendor bootstrap`

Will lookup the specified vendor library in `registry/vendor-libs.json` by name.
If an entry is found, will add this to vendor bundle entries in `aurelia.json`

Please update `registry/vendor-libs.json` with your favorite vendor library bundle specs. 

## Install plugin

`ai plugin :list` - to list registered plugins

`ai plugin validation`

Supported plugins: All the official and 3rd party plugins listed [here](http://blog.durandal.io/2015/11/17/aurelia-beta-week-day-2-plugins/) 

There is support for more customized install procedures, such as for `auth` and `materialize` plugins via custom installer classes. 
Please provide configuration your own plugins ;)

Currently the default installation procedure is to use `jspm`. With the new `init` command under development, you will soon be able to set project install preferences.

Please update `registry/plugins.json` with your favorite auelia plugins.

## Typings

Install TypeScript `d.ts` file(s) for a vendor library.

`ai typings :list` - list registered typing installs

`ai typings nprogress` - install typings for nprogress

Uses `registry/typings.json` for custom definitions which can't be installed for Aurelia by name via standard [typings](https://github.com/typings/typings).
By default issues this command: `typings install <name> --global`

Typings example: `typings install nprogress --global`

Note: This command will abort unless you have `typescript` defined as your transpiler in `aurelia.json` 

Please update the `registry/typings.json` with more typings download commands ;)

## Development

First link module globally:

`npm link`

Then continue development and test commands in an test Aurelia project. 

## License

MIT