System.import('jquery')
 .then(jquery => {
   window.jQuery = jquery;
   window.$ = jquery;

   // now load and start aurelia
   return System.import('aurelia-bootstrapper');
 });
