const m = require("mithril")
const timeBox = require("./time");
const alarmBox = require("./alarm/box");

const main = () => {
  const modules = [];
  return {
    oninit: (vnode) => {
      this.eventSocket = new WebSocket("ws://localhost:8081/ws")
      this.eventSocket.onopen = () => {
        this.eventSocket.send("Hello WS Server");
      };
      this.eventSocket.onmessage = wsmessage => {
        const test = JSON.parse(wsmessage.data)
        alert(test.message);
      };
    },
    observer: ((key, f) => {
      modules.push({ key, f });
    }),
    switch: (key => {
      modules.map(mod => {
        if (mod.key === key) return mod.f(false);
        return mod.f(true);
      })
    }),
    modal: null,
    view: (vnode) => {
      return m(".container", [
        m(timeBox, { setObserver: vnode.state.observer, switch: vnode.state.switch, modal: (modal) => vnode.state.modal = modal }),
        m(alarmBox, { setObserver: vnode.state.observer, switch: vnode.state.switch, modal: (modal) => vnode.state.modal = modal }),
        vnode.state.modal
      ]);
    }
  }
};

module.exports = {
  main
};
