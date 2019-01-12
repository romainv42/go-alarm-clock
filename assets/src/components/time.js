const m = require("mithril");

const { menu } = require("./menu");

const Time = require("../models/realTime");

const realTime = {
  view: (vnode) => {
    return m("div#realtime", [
      m("span#hhmm", vnode.state.hhmm),
      m("span#ss", vnode.state.ss)
    ]);
  },
  oncreate: (vnode) => {
    vnode.state = { hhmm, ss } = Time;
    Time.init();
  }
};

const timeBox = () => {
  return {
    view: () => {
      return m(".timeBox.big", [
        m(menu),
        m(realTime)
      ]);
    }
  }
};

module.exports = {
  timeBox
};
