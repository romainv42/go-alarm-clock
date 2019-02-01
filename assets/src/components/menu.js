const m = require("mithril");

const Time = require("../services/realTime");

const menu = () => {
  return {
    view: (vnode) => {
      return m("nav", [
        m("ul", [
          m("li#dateDisplay", new Date().toLocaleDateString()),
          m("li#switchDisplay", [
            m("i.fas.fa-moon", { onclick: () => document.body.className = "night" }),
            m("i.far.fa-sun", { onclick: () => document.body.className = "day" })
          ]),
          m("li#settings", [
            m("i.fas.fa-cogs", { onclick: () => vnode.attrs.switch("settings") })
          ])
        ])
      ]);
    },
    oncreate: (vnode) => {
      Time.init(date => document.getElementById("dateDisplay").innerText = date.toLocaleDateString())
    }
  }
};

module.exports = {
  menu
};
