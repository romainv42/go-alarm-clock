const m = require("mithril");

module.exports = {
  view: (vnode) => {
    return m("div", [
      m(".overlay"),
      m(".modal", [
        vnode.attrs.modal
      ])
    ]);
  }
};
