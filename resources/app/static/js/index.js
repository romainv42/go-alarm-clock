
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


            document.getElementById("nexttime").onclick = () => 
                astilectron.sendMessage({name:"test.alarm"});

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
        astilectron.onMessage(async message => {
            switch (message.name) {
                case "alarm.wakeup":
                    alarm.wakeup();
                    break;
                case "alarm.next":
                    break;
                default:
                    return;
            }
        });
    }
};
