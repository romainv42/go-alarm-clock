const m = require("mithril");
const modal = require("../modal");

const show = (node, musicController) => {
  musicController.alarmPlay();

  node.modal = m(modal, {
    modal: [
      m("h1", "Réveille-toi"),
      m("i#wakeup.fas.fa-bell"),
      m(".options", [
        m("button", {
          onclick: () => {
            musicController.pause();
            setTimeout(show, 5 * 60000, node);
            return node.modal = null;
          }
        }, "Snooze"),
        m("button", {
          onclick: () => {
            musicController.pause();
            node.modal = null;
          }
        }, "Off")
      ])
    ]
  });
  m.redraw();
};

module.exports = {
  show
};
