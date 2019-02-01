const m = require("mithril");
const { Settings } = require("../services/settings")

module.exports = {
  oninit: (vnode) => {
    vnode.state.small = true;
    Settings.load()
    vnode.attrs.setObserver("volume", (reduce) => {
      vnode.state.small = reduce;
    });
  },
  view: (vnode) => m(".settings", { class: `${vnode.state.small ? "small" : "big"}` }, [
    m("h1", [
      m("i.fas.fa-volume-down"),
      "Volume"
    ]),
    m("span", [
      m("input#volume-range.range", { type: "range", min:1, max: 100, value: Settings.volume, onchange: (e) => Settings.save(e.target.value) })
    ]),
    m(".actions", [
      m("button", { onclick: () => { vnode.attrs.switch("time") } }, "Fermer")
    ])
  ])
};
