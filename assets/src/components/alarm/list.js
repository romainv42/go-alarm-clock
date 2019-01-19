const m = require("mithril");
const modal = require("../modal");

const alarmRow = {
  oninit: (vnode) => {
    vnode.state.item = vnode.attrs.item;
    vnode.state.index = vnode.attrs.index;
    vnode.state.modal = vnode.attrs.modal;
    vnode.state.alarmModel = vnode.attrs.alarmModel;
  },
  view: (vnode) => {
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
    const parts = vnode.state.item.expression.trim().split(" ");


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

    return m(`li#row${vnode.state.index}`, [m("span.time", [
      `${
      parseInt(parts[1]) < 10 ? "0" + parts[1] : parts[1]
      }:${
      parseInt(parts[0]) < 10 ? "0" + parts[0] : parts[0]
      }`,
      m("ul.recurrent", daysOfWeek.map((_, index) => {
        return m(`li.day${index}`, {
          class: active.indexOf(index) < 0 ? "" : "active",
          onclick: () => {
            const actived = active.indexOf(index);
            if (actived < 0) {
              active.push(index);
            } else {
              active.splice(actived, 1);
            }
            active.sort();
            parts[4] = active.join(",");
            vnode.state.item.expression = parts.join(" ");
            vnode.state.alarmModel.save(vnode.state.index, vnode.state.item);
          }
        }, "")
      }))
    ]),
    m(".actions", { style: "float: right" }, [
      m("i", {
        class: `${vnode.state.item.enable ? "fas fa-bell" : "far fa-bell-slash"}`,
        onclick: () => {
          vnode.state.item.enable = !vnode.state.item.enable;
          vnode.state.alarmModel.save(vnode.state.index, vnode.state.item);
        }
      }),
      m("i.far.fa-trash-alt", {
        onclick: () => {
          vnode.state.modal(m(modal, {
            modal: [
              m("h1", "Confirmation"),
              m("p", "Êtes-vous sûr de vouloir supprimer cette alarme ?"),
              m(".options", [
                m("button", {
                  onclick: () => {
                    vnode.state.alarmModel.remove(vnode.state.index);
                    return vnode.state.modal(null);
                  }
                }, "oui"),
                m("button", { onclick: () => vnode.state.modal(null) }, "non")
              ])
            ]
          }));
        }
      })]
    )]);
  }
};



module.exports = {
  modal: null,
  oninit: (vnode) => {
    vnode.state.alarms = vnode.attrs.alarm;
    vnode.state.modal = vnode.attrs.modal;
    vnode.state.parent = vnode.attrs.parent;
  },
  oncreate: (vnode) => vnode.state.alarms.loadList(),
  view: (vnode) => m(".list", [
    m("ul", vnode.state.alarms.list.map((a, idx) => m(alarmRow, { index: idx, item: a, alarmModel: vnode.state.alarms, modal: vnode.state.modal }))),
    m("div", [
      m("button", {
        onclick: () => {
          vnode.state.parent.state.setNew = true;
        }
      }, "Nouvelle alarme")
    ])
  ])
};
