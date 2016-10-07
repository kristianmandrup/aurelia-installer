const programs = [ 
  'bundle', 
  'create', 
  'init', 
  'install', 
  'unbundle', 
  'uninstall'
];

programs.map(prog => {
  require(`./${prog}`)
});
