const m = require("mithril");

let Alarms;

module.exports = {
  oninit: (vnode) => {
    vnode.state.alarms = vnode.attrs.alarm;
  },
  oncreate: (vnode) => vnode.state.alarms.loadNext(),
  view: (vnode) => {
    return m(".next", {
      onclick: () => {
        vnode.attrs.switch("alarm")
      }
    }, vnode.state.alarms.next ? [
      m("#nextdate", vnode.state.alarms.next.toLocaleDateString(navigator.language || navigator.userLanguage, { weekday: 'long' })),
      m("#nexttime", `${
        vnode.state.alarms.next.getHours() < 10 ? "0" + vnode.state.alarms.next.getHours() : vnode.state.alarms.next.getHours()
        }:${
        vnode.state.alarms.next.getMinutes() < 10 ? "0" + vnode.state.alarms.next.getMinutes() : vnode.state.alarms.next.getMinutes()
        }`),
    ] : null)
  }
}
