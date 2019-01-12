const m = require("mithril");

const refreshingDate = () => {
  const today = new Date();
  document.getElementById("dateDisplay").innerText = today.toLocaleDateString();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDay() + 1, 0, 0, 0, 0);
  setTimeout(refreshingDate, tomorrow.getTime() - today.getTime());
};

const menu = () => {
  return {
    view: () => {
      return m("nav", [
        m("ul", [
          m("li#dateDisplay", new Date().toLocaleDateString()),
          m("li#switchDisplay", [
            m("i.fas.fa-moon", {onclick: () => document.body.className = "night" }),
            m("i.far.fa-sun", {onclick: () => document.body.className = "day" })
          ]),
          m("li#brightness", [
            m("i.fas.fa-adjust")
          ]),
          m("li#volume", [
            m("i.fas.fa-volume-up")
          ]),
          m("li#settings", [
            m("i.fas.fa-cogs")
          ])
        ])
      ]);
    },
    onCreate: () => {
      refreshingDate();
      console.log("coucou");
    }
  }
};

module.exports = {
  menu
};
