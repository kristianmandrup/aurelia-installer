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
- `install` install from git repo
- `bundle` bundle with app
- use it!

*Vendor library*
- `bundle` bundle a vendor library

*Plugin*
- `plugin` install and configure a plugin


## Components

A component is an application entity. Typically it consists of at least a *ViewModel* with an optional *View* associated.
The component can also have dependencies to external modules and 3rd party libraries.

Components are meant as a larger entities than elements, which are primitives, like molecule vs. atom.
A component can contain other components and use elements! Each component lives in its own folder for clean separation.

### Mounting components

You can mount components directly into your application on a given mount path which often coresponds closely to a route.
Unmounted components by convention live in `src/components`.

### Component management

`aurelia-installer` can manage the *creation*, *installation* and application *bundling* of such components!
The installe keeps track of your components in `components.json`, a component registry.
This registry is used to intelligently *uninstall* a component by name. 

### Sample component

[contact-detail](https://github.com/kristianmandrup/contact-detail) is a sample component

*Unmounted component example*

Unmounted components are by default installed under `src/components`. 
This is sensible for general purpose components such as 'large-modal; that are reused in multiple parts of your app.

```bash
src/components/large-modal
  large-modal.html
  large-modal.ts
  package.json
  vendor-bundles.js
```

*Mounted under contacts*

Components specific to a particular domain should be mounted in that domain, such as `contacts`

```bash
src/contacts/contact-detail
  contact-detail.html
  contact-detail.ts
  package.json
  vendor-bundles.js
```

### Install component from repo

Downloads a component from a git repo and copies it to your project

`ai install kristianmandrup/contact-detail`

Repo formats available see [here](https://www.npmjs.com/package/download-git-repo)

- GitHub: github:owner/name or simply owner/name
- GitLab: gitlab:owner/name
- Bitbucket: bitbucket:owner/name

### Bundle component(s)

`ai bundle` (all) or `ai bundle contact-detail`

This will merge the component dependencies with app dependencies in a crafty manner, almost like if you had done it by hand.

### Use it

Currently awaiting a [PR](https://github.com/aurelia/router/pull/381) for full route loading customization! 

You can also use it as follows:

`{ route: 'contacts',  moduleId: 'components/contact-detail/contact-detail', name: 'contacts' }`

Ready to rock!

### Uninstall

`ai uninstall contact-detail`

Removes the component from your app! 

TODO: remove bundled component dependencies...

## Bundle vendor library

`ai vendor bootstrap`

Will lookup the specified vendor library in `registry/vendor-libs.json` by name.
If an entry is found, will add this to vendor bundle entries in `aurelia.json` 

## Install plugin

`ai plugin validation`

Supported plugins: All the official and 3rd party plugins listed [here](http://blog.durandal.io/2015/11/17/aurelia-beta-week-day-2-plugins/) 

Simple plugins can be configured directly via `registry/plugins.json`.

There is support for more customized install procedures, such as for `auth` and `materialize` plugins via custom installer classes. 
Please provide configuration your own plugins ;)

Currently the default installation procedure is to use `jspm`. With the new `init` command under development, you will soon be able to set project install preferences.

## Install typings

*WIP*

Install TypeScript `d.ts` file(s) for a vendor library.

`ai typings nprogress`

Uses `registry/typings.json` for custom definitions which can't be installed for Aurelia by name via standard [typings](https://github.com/typings/typings).
By default issues this command: `typings install <name> --save`

Typings example: `typings install nprogress --save`

Note: This command will abort unless you have `typescript` defined as your transpiler in `aurelia.json` 

## Init project settings

*WIP*

We will soon add the ability to set project (install/config) preferences, which will be saved as part of the `aurelia-project/aurelia.json` configuration file.

#### Contribute vendor bundle specs

Please update the `registry/vendor-libs.json` with bundling specifications for your favourite libs ;)

## Development

First link module globally:

`npm link`

Then continue development and test commands in an test Aurelia project. 

## License

MIT