const m = require("mithril");

module.exports = {
  oninit: (vnode) => this.musicController = vnode.attrs.musicController,
  view: (vnode) => m("div#audio.small", [
    m("i.fas.fa-music", { style: "display: \"table-row\""}),
    m("span#previous.control.fas.fa-step-backward", { onclick: () => this.musicController.playPrevious() }),
    this.musicController.isPlaying()
      ? m("span#pause.control.fas.fa-pause", { onclick: () => this.musicController.pause() })
      : m("span#play.control.fas.fa-play", { onclick: () => this.musicController.play() }),
    m("span#next.control.fas.fa-step-forward", { onclick: () => this.musicController.playNext() })
  ])
};
