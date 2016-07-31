# <%= name %>

Aurelia component: <%= name %> 

## Install the Auralia installer

Install the Aurelia component installer globally

`npm i aurelia-installer -g`

This will install a new `ai` binary

## Usage

- install component from git repo
- bundle with app
- use it

### Install component

`ai install kristianmandrup/<%= name %>`

This will install the component at:

```bash
src/components/<%= name %>/
  <%= name %>.html
  <%= name %>.ts
  package.json
  vendor-bundles.js
  Readme.md
```

Git repo formats supported:

- GitHub: github:owner/name or simply owner/name
- GitLab: gitlab:owner/name
- Bitbucket: bitbucket:owner/name

### Bundle with app

`ai bundle` (all) or `ai bundle <%= name %>`

This will merge your component dependencies with app dependencies in a crafty manner, almost like if you had done it by hand.

### Usage

Currently awaiting a [PR](https://github.com/aurelia/router/pull/381) for full route loading customization! 

You can also use it as follows:

`{ route: 'contacts',  moduleId: 'components/contact-detail/contact-detail', name: 'contacts' }`

Ready to rock!

## TODO

- Registry for installing vendor and 3rd party libraries by name 

## License

