function subscribe() {  
  // Disable the button so it can't be changed while  
  // we process the permission request  
  var pushButton = document.querySelector('.js-push-button');  
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
    serviceWorkerRegistration.pushManager.subscribe()  
      .then(function(subscription) {  
        // The subscription was successful  
        isPushEnabled = true;  
        pushButton.textContent = 'Disable Push Messages';  
        pushButton.disabled = false;

        // TODO: Send the subscription.endpoint to your server  
        // and save it to send a push message at a later date
        return sendSubscriptionToServer(subscription);  
      })  
      .catch(function(e) {  
        if (Notification.permission === 'denied') {  
          // The user denied the notification permission which  
          // means we failed to subscribe and the user will need  
          // to manually change the notification permission to  
          // subscribe to push messages  
          console.warn('Permission for Notifications was denied');  
          pushButton.disabled = true;  
        } else {  
          // A problem occurred with the subscription; common reasons  
          // include network errors, and lacking gcm_sender_id and/or  
          // gcm_user_visible_only in the manifest.  
          console.error('Unable to subscribe to push.', e);  
          pushButton.disabled = false;  
          pushButton.textContent = 'Enable Push Messages';  
        }  
      });  
  });  
}