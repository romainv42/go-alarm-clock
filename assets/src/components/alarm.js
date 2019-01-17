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
          m("ul", Alarms.list.map((a, idx) => {
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

            subs.push(m("span.time", `${
              parts[2] < 10 ? "0" + parts[1] : parts[1]
              }:${
              parts[1] < 10 ? "0" + parts[0] : parts[0]
              }`
            ));

            if (parts[4] === "*") {
              parts[4] = "0-7";
            }
            const active = [].concat.apply([], parts[4].split(",").map(val => {
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
              return m(`li.day${index}`, {
                class: active.indexOf(index) > 0 ? "active" : "",
                onclick: () => {
                  const actived = active.indexOf(index);
                  if (actived < 0) {
                    active.push(index);
                  } else {
                    active.splice(actived, 1);
                  }
                  parts[4] = active.join(",");
                  a.expression = parts.join(" ");
                  Alarms.save(idx, a);
                }
              }, "")
            })));

            return m(`li#row${idx}`, subs
              .concat([
                m("i", {
                  class: `${a.enable ? "fas fa-bell" : "far fa-bell-slash"}`,
                  onclick: () => Alarms.saveState(idx, !a.enable)
                }, ""),
                m("i.far.fa-trash-alt", {
                  onclick: () => Alarms.remove(idx)
                })
              ]));
          }))
        ])
      ]);
    }
  }
}

module.exports = alarmBox;
