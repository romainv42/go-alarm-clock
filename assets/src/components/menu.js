const m = require("mithril");

const Time = require("../models/realTime");

const menu = () => {
  return {
    view: () => {
      return m("nav", [
        m("ul", [
          m("li#dateDisplay", new Date().toLocaleDateString()),
          m("li#switchDisplay", [
            m("i.fas.fa-moon", { onclick: () => document.body.className = "night" }),
            m("i.far.fa-sun", { onclick: () => document.body.className = "day" })
          ]),
          m("li#brightness", [
            m("i.fas.fa-adjust")
          ]),
          m("li#volume", [
            m("i.fas.fa-volume-up")
          ]),
          m("li#settings", [
            m("i.fas.fa-cogs")
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
