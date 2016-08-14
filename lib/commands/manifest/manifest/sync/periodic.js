function registerPeriodicSync() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function(reg) {
            if (reg.periodicSync) {
                reg.periodicSync.register({
                        tag: 'periodicSync',
                        minPeriod: 0,
                        powerState: 'auto',
                        networkState: 'any'
                    })
                    .then(function(event) {
                        console.log('Periodic Sync registration successful', event);
                    })
                    .catch(function(error) {
                        console.log('Periodic Sync registration failed', error);
                    });
            } else {
                console.log("Background Sync not supported");
            }
        });
    } else {
        console.log("No active ServiceWorker");
    }
}