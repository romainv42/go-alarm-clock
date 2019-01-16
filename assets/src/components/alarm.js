const m = require("mithril");
const { switchDisplay } = require("./utils");
const Alarms = require("../models/alarm");


const alarmBox = () => {
  return {
    oninit: () => Alarms.loadNext(),
    view: (vnode) => {
      return m("#alarmBox.small", [
        m("header", [
          m("i.fas.fa-bell"),
          m("span.title")
        ]),
        m(".next", {
          onclick: () => {
            switchDisplay("alarmBox");
            Alarms.loadList();
          }
        }, Alarms.next ? [
          m("#nextdate", Alarms.next.toLocaleDateString(navigator.language || navigator.userLanguage, { weekday: 'long' })),
          m("#nexttime", `${
            Alarms.next.getHours() < 10 ? "0" + Alarms.next.getHours() : Alarms.next.getHours()
            }:${
            Alarms.next.getMinutes() < 10 ? "0" + Alarms.next.getMinutes() : Alarms.next.getMinutes()
            }`),
        ] : null),
        m(".list", [
          m("ul"), Alarms.list.map((a, idx) => {
            return m("li", a.expression.trim().split(" ").map((e, i) => m("span", e))
              .concat([
                m("i", {
                  class: `${a.enable ? "fas fa-bell" : "far fa-bell-slash"}`,
                  onclick: () => Alarms.saveState(idx, !a.enable)
                 }, ""),
                m("i.far.fa-trash-alt", {
                  onclick: () => Alarms.remove(idx)
                })
              ])
            )
          })])
      ]);
    }
  }
}

module.exports = alarmBox;
