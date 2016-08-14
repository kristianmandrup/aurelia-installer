function registerOneTimeSync() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function(reg) {
            if (reg.sync) {
                reg.sync.register('oneTimeSync')
                    .then(function(event) {
                        console.log('Sync registration successful', event);
                    })
                    .catch(function(error) {
                        console.log('Sync registration failed', error);
                    });
            } else {
                console.log("Onw time Sync not supported");
            }
        });
    } else {
        console.log("No active ServiceWorker");
    }
}