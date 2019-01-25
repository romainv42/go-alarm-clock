const m = require("mithril");

module.exports = {
  oninit: (vnode) => {
    this.parent = vnode.attrs.parent;
    this.alarmModel = vnode.attrs.alarm;
    this.hour = 0;
    this.minute = 0;
    this.days = [0, 1, 2, 3, 4, 5, 6];
    this.active = [];

    this.incrementHour = (v) => {
      this.hour = (this.hour + 24 + v) % 24;
    }

    this.incrementMinute = (v) => {
      this.minute = (this.minute + 60 + v) % 60;
    }

    this.switch = (idx) => {
      if (this.active.indexOf(idx) < 0) {
        this.active.push(idx);
      } else {
        this.active.splice(this.active.indexOf(idx), 1);
      }
      this.active.sort();
    }
  },
  view: (vnode) => m("div.selecter", [
    m("div.hourSwitch", [
      m("button.fas.fa-angle-double-up", { onclick: () => this.incrementHour(6) }),
      m("button.fas.fa-angle-up", { onclick: () => this.incrementHour(1) }),
      m("span", parseInt(this.hour) < 10 ? "0" + this.hour : this.hour),
      m("button.fas.fa-angle-down", { onclick: () => this.incrementHour(-1) }),
      m("button.fas.fa-angle-double-down", { onclick: () => this.incrementHour(-6) }),
    ]),
    m("div", [m("span.separator", ":")]),
    m("div.minuteSwitch", [
      m("button.fas.fa-angle-double-up", { onclick: () => this.incrementMinute(15) }),
      m("button.fas.fa-angle-up", { onclick: () => this.incrementMinute(1) }),
      m("span", parseInt(this.minute) < 10 ? "0" + this.minute : this.minute),
      m("button.fas.fa-angle-down", { onclick: () => this.incrementMinute(-1) }),
      m("button.fas.fa-angle-double-down", { onclick: () => this.incrementMinute(-15) }),
    ]),
    m("div.days", [m("ul.recurrent", this.days.map((_, idx) => m(`li.day${idx}`, {
      class: this.active.indexOf(idx) < 0 ? "" : "active",
      onclick: () => this.switch(idx)
    }, "")),
    )]),
    m("div.actions", [
      m("a", { onclick: () => this.parent.state.setNew = false }, [m("i.fas.fa-undo"), " Annuler"]),
      m("a", {
        onclick: () => {
          const expression = `${this.minute} ${this.hour} * * ${this.active.length > 0 ? this.active.join(",") : "*"}`
          this.alarmModel.insert({ expression, enable: true })
          this.parent.state.setNew = false;
        }
      }, [
          m("i.fas.fa-check"),
          " Sauver"
        ])
    ])
  ])
};
