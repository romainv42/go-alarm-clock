const m = require("mithril");

module.exports = (() => {
  const player = new Audio();
  let playlist;
  let current = 0;

  const loadPlaylist = () => {
    m.request({
      method: "GET",
      url: "/api/music"
    }).then(arr => {
      playlist = arr;
      player.src = `file://${playlist[current]}`;
    });
  };

  loadPlaylist();

  const playNext = () => {
    current = (current + 1) % playlist.length;
    player.src = `file://${playlist[current]}`;
  }

  const playPrevious = () => {
    current = (current - 1 + playlist.length) % playlist.length;
    player.src = `file://${playlist[current]}`;
    player.play();
  }

  const play = () => {
    player.play();
  };

  const pause = () => {
    player.pause();
  };

  player.addEventListener("onended", () => playNext());

  return {
    play,
    pause,
    playNext,
    playPrevious,
    isPlaying: () => !player.paused
  };

})();
