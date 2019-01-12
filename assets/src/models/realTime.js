const m = require("mithril");

const realTime = {
  hhmm: "",
  ss: "",
  date: "",
  init: () => setTimeout(realTime.refresh, 1000),
  refresh: () => {
    const date = new Date();
    realTime.hhmm = `${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
      }:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      }`;
    realTime.ss = `:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`
    realTime.date = date.toLocaleDateString();
    m.redraw();
    setTimeout(realTime.refresh, 1000);
  }
}

module.exports = realTime;
