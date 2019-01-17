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
          m("ul"), Alarms.list.map((a) => {
            // REMINDER: SS MI HH DM MO DW YR
            const daysOfWeek = [
              "SUN",
              "MON",
              "TUE",
              "WED",
              "THU",
              "FRI",
              "SAT"
            ];
            const subs = [];
            const parts = a.expression.trim().split(" ");
            if (parts.length === 5) {
              parts.unshift(0);
            }
            if (parts.length === 6) {
              parts.push("*");
            }

            subs.push(m("span.time", `${
              parts[2] < 10 ? "0" + parts[2] : parts[2]
              }:${
              parts[1] < 10 ? "0" + parts[1] : parts[1]
              }`
            ));

            if (parts[5] === "*") {
              parts[5] = "0-7";
            }
            const active = [].concat.apply([], parts[5].split(",").map(val => {
              const regex = /([0-9]|[A-Z]{3})-([0-9]|[A-Z]{3})/gi;
              const matches = regex.exec(val);
              if (matches) {
                let [_, start, end] = matches;
                start = isNaN(start) ? daysOfWeek.indexOf[start] : start % 7;
                end = isNaN(end) ? daysOfWeek.indexOf[end] : end;
                const temp = [];
                for (let i = start; i <= end; i++) {
                  temp.push(i % 7);
                }
                return temp;
              } else {
                if (isNaN(val)) {
                  return daysOfWeek.indexOf(val);
                }
                return val % 7;
              }
            })).filter((v, i, a) => a.indexOf(v) === i);

            subs.push(m("ul.recurrent", daysOfWeek.map((_, index) => {
              return m(`li.day${index}`, { class: active.indexOf(index) > 0 ? "active" : "" }, "")
            })));

            return m("li", subs
              // return m("li", a.expression.trim().split(" ").map((e, i) => m("span", e))
              .concat([
                m("i", {
                  class: `${a.enable ? "fas fa-bell" : "far fa-bell-slash"}`,
                  onclick: () => Alarms.saveState(idx, !a.enable)
                }, ""),
                m("i.far.fa-trash-alt", {
                  onclick: () => Alarms.remove(idx)
                })
              ]));
            // )
          })])
      ]);
    }
  }
}

module.exports = alarmBox;
