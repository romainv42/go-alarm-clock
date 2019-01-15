const m = require("mithril");
const { switchDisplay } = require("./utils");


const Alarms = {
  loadNext: () => {
    return m.request({
      method: "GET",
      url: "/api/alarm/next"
    })
      .then(result => Alarms.next = new Date(result.next))
  },
  loadList: () => {
    return m.request({
      method: "GET",
      url: "/api/alarm/list"
    })
      .then(result => Alarms.list = result)
  },
  list: [],
  next: null
}

const alarmBox = () => {
  return {
    oninit: () => Alarms.loadNext(),
    view: (vnode) => {
      return m("#alarmBox.small", [
        m("header", [
          m("i.fas.fa-bell")
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
        m(".list", Alarms.list.map(a => {
          console.log(a);
          return;
        }))
      ]);
    }
  }
}

module.exports = alarmBox;
