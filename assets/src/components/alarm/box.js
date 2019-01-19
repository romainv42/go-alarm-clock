const m = require("mithril");
const Alarms = require("../../models/alarm");
const next = require("./next");
const list = require("./list");
const newAlarm = require("./new");

const alarmBox = {
  small: true,
  setNew: false,
  oninit: (vnode) => {
    vnode.attrs.setObserver("alarm", (reduce) => {
      vnode.state.small = reduce;
    });
  },
  view: (vnode) => {
    return m("#alarmBox", { class: `${vnode.state.small ? "small" : "big"}` }, [
      m("header", [
        m("i.fas.fa-bell"),
        m("span.title")
      ]),
      m(vnode.state.small ? next : (vnode.state.setNew ? newAlarm : list), { alarm: Alarms, switch: vnode.attrs.switch, modal: vnode.attrs.modal, parent: vnode })
    ]);
  }
};

module.exports = alarmBox;
