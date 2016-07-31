# App layout guidelines

The Aurelia installer assumes the following app layout for large scale applications. 
This is inspired heavily by [best practices for aurelia application structure](http://patrickwalters.net/my-best-practices-for-aurelia-application-structure/)
with the addition of multiple apps.

You can use the `ai init` command to customize this layout to suit your needs or edit the `app-layout.json` file directly.

```bash
src/
  apps/

    /guest      
      /pages
        router.js
        /login
          index.js
          index.html
          
      /services
        index.js // re-exports all

      /components
      /resources

    /user
      /pages
        router.js
        /contacts
          index.js
          index.html
          /one
            index.js
            index.html

        /session
          index.js
          index.html

      /services

      /components
        index.html

        /contacts
          index.js
          index.html

          /details
            index.js
            index.html

          /assets
            contact.png            

          service.js          
          store.js
          package.json
          vendor-bundles.json          

        /user

      /resources
        index.html
        /attributes
        /binding-behaviors
        /elements
          /progress-bar
            index.js
            index.html          
            package.json          
            bundles.json

        /value-converters 

    /admin
      /pages
      /services
      /components
      /resources

  assets/
    /images
    /styles
    /fonts

  shared/
    /services
    /components
    /resources

  plugins/
    index.js
    auth.js
    ...

```

### Assets

We recommend using Webpack as the package manager and bundler tool of choice!
Load your assets directly from the `.js` files which need them!

### Plugins

Use `feature('plugins')` when configuring aurelia to centralize plugins configuration. Have separate plugin config files
for plugins that require more refined customization.

### Components

Use `feature('components')` and `feature('resources')` so as to faciliate choosing which ones to make `globalResources`.

Pages are components that usually has a View (the page to display), but can optionally use another rendering method.
An element is a reusable page fragments.    

Any component can have its own repo. A component can also be a hierarchy of sub-components with their own repo.
To manage dependencies to external libs, each component can have a `vendor-bundles.json` file. 

Note also that certain components may have their own assets in an `/assets` folder. 
Include the assets (using appropriately installed Webpack loader) directly from your `.js` file. 

### Pages

Pages are special components to display a full "page" in your app. They can be seen as top-level molecules.

### Services

Services should always be Singletons and so should never use `@transient`.
Note that some services are general purpose for the entire app. 
For services specific to a page or component, put it there where it rightfully belongs.

You should always be able to freely move a domain object: page or component as an independent, encapsulated entity.

## Switching apps on type of user 

```js
aurelia.start().then(() => aurelia.setRoot('apps/guest'));

// when logged in as user
aurelia.setRoot('apps/app'));

// when logged in as admin
aurelia.setRoot('apps/admin'));
```
