let index = {
    init: () => {
        // Init
        asticode.loader.init();
        asticode.modaler.init();
        asticode.notifier.init();

        // Wait for astilectron to be ready
        document.addEventListener('astilectron-ready', function() {
            // Listen
            index.listen();
            index.displayDateTime();
        })
    },
    displayDateTime: () => {
        const now = new Date();
        document.getElementById("date").innerText = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        document.getElementById("clock").innerText = time
        setTimeout(() => index.displayDateTime(), 1);
    },
    switchDisplay: () => {
        const current = document.body.className;
        if (current == "day") {
            document.body.className = "night";
        } else {
            document.body.className = "day";
        }
    },
    listen: () => {

    }
};
