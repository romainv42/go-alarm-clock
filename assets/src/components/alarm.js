const m = require("mithril");

const Alarms = {
  load: () => {},
  list: [],
  next: new Date()
}

const alarmBox = () => {
  return {
    oninit: () => Alarms.load(),
    view: () => {
      return m("#alarmBox.small", [
        m("header", [
          m("i.fas.fa-bell")
        ]),
        m(".next", [
          m("#nextdate", Alarms.next.toLocaleDateString(navigator.language || navigator.userLanguage, { weekday: 'long'})),
          m("#nexttime", `${
            Alarms.next.getHours() < 10 ? "0" + Alarms.next.getHours() : Alarms.next.getHours()
            }:${
            Alarms.next.getMinutes() < 10 ? "0" + Alarms.next.getMinutes() : Alarms.next.getMinutes()
            }`),
        ])
      ]);
    }
  }
}

module.exports = alarmBox;
