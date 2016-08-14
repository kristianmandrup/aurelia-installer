// Register the service worker if available.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
        console.log('Successfully registered service worker', reg);
        initialiseState();
    }).catch(function(err) {
        console.warn('Error whilst registering service worker', err);
    });
}

var isPushEnabled = false;

window.addEventListener('load', function() {  
  var pushButton = document.querySelector('.js-push-button');  
  pushButton.addEventListener('click', function() {  
    if (isPushEnabled) {  
      unsubscribe();  
    } else {  
      subscribe();  
    }  
  });
});

window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    Page.hideOfflineWarning();
    Arrivals.loadData();
}, false);

window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    Page.showOfflineWarning();
}, false);

// Check if the user is connected.
if (navigator.onLine) {
    if (appLoader && appLoader.loadData) {
      appLoader.loadData();
    }
} else {
    // Show offline message
    Page.showOfflineWarning();
}
