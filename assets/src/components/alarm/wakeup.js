const m = require("mithril");
const modal = require("../modal");

const show = (node) => {
  console.log("wakeup");
  node.modal = m(modal, {
    modal: [
      m("h1", "Réveille-toi"),
      m("i#wakeup.fas.fa-bell", ""),
      m(".options", [
        m("button", {
          onclick: () => {
            setTimeout(show, 5 * 60000, node);
            return node.modal = null;
          }
        }, "Snooze"),
        m("button", { onclick: () => node.modal = null }, "Off")
      ])
    ]
  });
  m.redraw();
};

module.exports = {
  show
};
