const m = require("mithril");
const Light = require("../services/light")


module.exports = {
  oninit: Light.load,
  view: () => m("div#light.small", [
    m("div", [
      m("i.fa-lightbulb", { class: `${Light.state.isOn ? "fas" : "far"}`, onclick: Light.switch })
    ]),
    m("input", { type: "range", min: 0, max: 255, value: Light.state.level, oninput: e => Light.changeState(e.target.value), disabled: !Light.state.isOn })
  ])
};
