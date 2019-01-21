const m = require("mithril")
const timeBox = require("./time");
const alarmBox = require("./alarm/box");
const wakeup = require("./alarm/wakeup");
const jukeBox = require("./music");

const musicController = require("../services/music");

const websocket = require("../services/websocket");

const main = () => {
  const modules = [];
  return {
    oninit: (vnode) => {
      websocket.subscribe({ kind: "alarm", method: () => {
        wakeup.show(vnode.state, musicController);
      }});
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
        m(jukeBox, { setObserver: vnode.state.observer, musicController }),
        vnode.state.modal
      ]);
    }
  }
};

module.exports = {
  main
};
