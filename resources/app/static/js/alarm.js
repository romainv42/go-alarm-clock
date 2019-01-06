let alarm = {
    wakeup: () => {
        let c = document.createElement("div");
        c.onclick = () => asticode.modaler.close();
        c.innerHTML = "<i id=\"wakeup\" class=\"fas fa-bell\"></i>";
        asticode.modaler.setContent(c);
        asticode.modaler.show();
    }
};
