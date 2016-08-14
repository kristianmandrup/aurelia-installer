# Aurelia installer

The missing brother of [Aurelia CLI](https://github.com/aurelia/cli)

- Create and manage sub applications with different src layouts
- Create, install, manage and reuse/share components as real application entities
- Automatically configure vendor and 3rd party libraries
- Automatically install Typings for Typescript
- Install Aurelia plugins by name
- and more...

All automated and provided as a CLI for your Aurelia workflows!  

## Install

`npm i aurelia-installer -g`

## Usage

- `init` initialize your project for better `ai` experience (optional) 

*App layout*
- `ai app` create main app src layout  
- `ai app layout <name>` add additional app with own src layout 
- `ai app switch <name>` switch to working on a different app

*Plugin*
- `plugin <name>` install and configure a plugin
- `plugin :list` list all registered plugins

*Component*
- `create <name>` create a new component folder
- `install <name>` install/mount from git repo
- `uninstall <name>` install/unmount
- `bundle [name]` bundle component dependencies with app
- `unbundle <name>` unbundle component dependencies from app

*Vendor library*
- `library <name>` bundle a vendor library (with typings of same name if available)
- `library :list` list all registered vendor libs
- `library <name> :unbundle` unbundle a vendor lib

*Typings*
- `typings <name>` install typings for a vendor lib
- `typings :list` list all registered typings 

*Coming soon* Installer commands will effect only in current/designated app when you have multiple sub-apps!

## Init

We recommend that you first run `ai init` to initialize your installer preferences (stored in `installer.json`).

- App bundle manager (webpack or systemjs)
- Dependency module manager (npm or jspm)
- Default Git account
- Enable Git workflow
- Enable Auto bundling of component dependencies
- Default components path

## App config and layouts

`ai app`

Define app layout preferences:
- select src layout (`multi`, `simple` or `advanced`)
- select default app layout
- generates main app src layout (in `/src` folder)

### Generating app layouts

- `app layout <name> <laout name>` - add an app with a src layout

Examples:
- `app layout guest` - create default app layout for `guest` app
- `app layout login simple` - create `simple` app layout for `login`

Please contribute your own favorite app layouts!

### Select app to work on

Switch which application you are working on:

- `app switch <name>` - switch to work with selected app
- `app switch :root` - switch to src root

This will effect where components are created, mounted and unmounted   

## Components

A `component` is an application entity. Typically it consists of at least a *ViewModel* with an optional *View* associated.
The component can also have dependencies to external modules and 3rd party libraries.

Components are meant as a larger entities than `elements`, which are primitives, like molecule vs. atom.
A component can contain other components and elements! Each component lives in its own folder for clean separation.

Components are designed to make it trivial to share and reuse common application functionality across projects 
or within the Aurelia community. No more fudging around with complex configuration. The component is made ready to go!
Components are the modular keystones for Aurelia apps! 

Please see [how to structure an aurelia application](http://ilikekillnerds.com/2015/10/how-to-structure-an-aurelia-application/)

Components can be globalised for use as a custom element, by using `globalResources` via features.  

```js
export function configure(config) {
  config.globalResources('markdown/markdown', './disco-light', .. );
}
```

See [making custom element global](http://drdwilcox.blogspot.dk/2015/12/aurelia-making-custom-element-global.html)

### Mounting components

You should mount application components directly into your application on a given mount path which coresponds to a route (section of your app).
Unmounted components by convention live in `src/components`.

### Component management

`aurelia-installer` can manage the *creation*, *installation* and application *bundling* of components!
The installer keeps track of your components in `installer.json`. This registry is also used to later *uninstall* 
or find the location of a component by name if needed. 

### Sample component

[contact-detail](https://github.com/kristianmandrup/contact-detail) is a sample component

A component should have an *install.json* which tells the installer how to install its dependencies:
- named `bundles` (ie. pre-registered dependencies)
- `dependencies` configs for 3rd party libraries
- `typings` for 3rd party libraries

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

Note: You can also add a `"prepend"` section, for dependencies to be prepended to the bundle.

*Unmounted component example*
 
General purpose components such as 'large-modal` that are reused in multiple parts of your app remain unmounted
and live in `src/components`.

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

Download a component from a git repo directly into your application mount path

`ai install kristianmandrup/contact-detail contacts`

Repo formats available see [here](https://www.npmjs.com/package/download-git-repo)

- GitHub: `github:owner/name` or simply `owner/name`
- GitLab: `gitlab:owner/name`
- Bitbucket: `bitbucket:owner/name`

If you have run `ai init` and set a default git account, the installer will assume this account by default.
This means you can just write the name of your component repo to install it! 

`ai install contact-detail` - MAGIC!

After installing a component you need to bundle it with the app.

### Bundle component(s)

`ai bundle` (all) or `ai bundle contact-detail`

This will merge the component dependencies with app dependencies in a crafty manner!
It will also install any typings required for TypeScript.

### Uninstall

`ai uninstall contact-detail`

Removes the component from your app! 

Note: You can then `unbundle` component dependencies if needed.

## Bundle vendor library

`ai library :list` - to list registered vendor bundles

`ai library bootstrap` - install bootstrap library

Will lookup the specified vendor library in `registry/vendor-libs.json` by name.
If an entry is found, will add this to vendor bundle entries in `aurelia.json`

Please update `registry/vendor-libs.json` with your favorite vendor library bundle specs. 

## Install plugin

`ai plugin :list` - to list registered plugins

`ai plugin validation`

Supported plugins: All the official and 3rd party plugins listed [here](http://blog.durandal.io/2015/11/17/aurelia-beta-week-day-2-plugins/) 

There is also some support for more customized install procedures, such as for `auth` and `materialize` plugins via custom installer classes. 
Please provide configurations for your own plugins ;)

Please update `registry/plugins.json` with your favorite auelia plugins.

## Typings

Install TypeScript `d.ts` file(s) for a vendor library.

`ai typings :list` - list registered typing installs

`ai typings nprogress` - install typings for nprogress

Uses `registry/typings.json` for custom definitions which can't be installed for Aurelia by name via standard [typings](https://github.com/typings/typings).
If no typings install is registered, it will by default try to install from [DefinitelyTyped](http://definitelytyped.org/) repo: 

`typings install dt~<name> --global` such as `typings install dt~bootstrap --global`

Note: This command will abort unless you have `typescript` defined as your transpiler in `aurelia.json` 

Please update the `registry/typings.json` with more typings install locations ;)

## Coming soon

Planned features coming soon:

- Dependency check/management for bundles
- Git enabled workflow
- Manifest generation

### Dependency check/management

Many components will share a subset of dependencies while depending on unique libs for their own particular behavior.
Imagine a set of components all using bootstrap, but with different behavior, perhaps using 
different jquery plugins but sharing dependency on jquery etc. The developer should not be left to sort out and 
maintain this dependency hell! Component dependency management to the rescue!

*How it will work*

We need to monitor which installed components are bundled in `installer.json` (ie. `bundled: true`). 
We should also have an `autoBundling: true` setting. When we unbundle dependency libs of a component, 
we could iterate all installed components for their dependencies and check for overlaps.
Then only unbundle libs with no overlaps.         

### Git enabled workflow

The `ai init` should ask if git workflow should be enabled. If `gitWorkflow: true` in `installer.json`, each install command will be finalized
with its own commit unless there is an error. 

### Manifest generation - progressive web app

Create a `mainfest.json` file complete with Service Worker etc. 
Your web app will function almost like a native app when "installed".
It will support offline mode as well ;) 

## Development

First link module globally:

`npm link`

Then continue development and test commands in an test Aurelia project. 

## License

MIT