const m = require("mithril");

const realTime = (() => {
  let observerState = [];

  const refresh = () => {
    observerState.forEach(v => v(new Date()))
    setTimeout(refresh, 1000);
  };
  refresh();

  return {
    init: (s) => {
      observerState.push(s);
    }
  }
})();

module.exports = realTime;
