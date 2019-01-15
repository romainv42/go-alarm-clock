const m = require("mithril");
const utils = require("./utils");

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
    Time.init(date => {
      vnode.dom.childNodes.forEach(element => {
        if (element.id === "hhmm") {
          element.innerText = `${
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
            }:${
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
            }`;
        }
        if (element.id === "ss") {
          element.innerText = `:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`
        }
      });
    });
  }
};

const timeBox = () => {
  return {
    view: (vnode) => {
      return m("#timeBox.big", {
        onclick: () => vnode.dom.className == "small" ? utils.switchDisplay("timeBox") : null }, [
          m(menu),
          m(realTime)
        ]);
    }
  }
};

module.exports = {
  timeBox
};
