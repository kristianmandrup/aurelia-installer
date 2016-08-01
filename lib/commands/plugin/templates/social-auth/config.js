export default socialAuthConfig = {
  endpoint: 'auth',             // use 'auth' endpoint for the auth server 
  configureEndpoints: ['auth'],  // add Authorization header to 'auth' endpoint 
  facebook: {
      clientId: 'your client id' // set your third-party providers client ids 
  }
}

