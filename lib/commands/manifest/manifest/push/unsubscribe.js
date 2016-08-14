function unsubscribe() {  
  var pushButton = document.querySelector('.js-push-button');  
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
    // To unsubscribe from push messaging, you need get the  
    // subscription object, which you can call unsubscribe() on.  
    serviceWorkerRegistration.pushManager.getSubscription().then(  
      function(pushSubscription) {  
        // Check we have a subscription to unsubscribe  
        if (!pushSubscription) {  
          // No subscription object, so set the state  
          // to allow the user to subscribe to push  
          isPushEnabled = false;  
          pushButton.disabled = false;  
          pushButton.textContent = 'Enable Push Messages';  
          return;  
        }  

        var subscriptionId = pushSubscription.subscriptionId;  
        // TODO: Make a request to your server to remove  
        // the subscriptionId from your data store so you
        // don't attempt to send them push messages anymore

        // We have a subscription, so call unsubscribe on it  
        pushSubscription.unsubscribe().then(function(successful) {  
          pushButton.disabled = false;  
          pushButton.textContent = 'Enable Push Messages';  
          isPushEnabled = false;  
        }).catch(function(e) {  
          // We failed to unsubscribe, this can lead to  
          // an unusual state, so may be best to remove
          // the users data from your data store and
          // inform the user that you have done so

          console.log('Unsubscription error: ', e);  
          pushButton.disabled = false;
          pushButton.textContent = 'Enable Push Messages';
        });  
      }).catch(function(e) {  
        console.error('Error thrown while unsubscribing from push messaging.', e);  
      });  
  });  
}