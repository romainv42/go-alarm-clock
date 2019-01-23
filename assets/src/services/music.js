const m = require("mithril");

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = (() => {
  const player = new Audio();
  let playlist;
  let current = 0;

  let isShuffled = false;

  const loadPlaylist = () => {
    m.request({
      method: "GET",
      url: "/api/music"
    }).then(arr => {
      playlist = arr;
      player.src = `${playlist[current].replace("assets/", "")}`;
    });
  };

  loadPlaylist();

  const playNext = () => {
    const isPaused = player.isPaused;
    current = (current + 1) % playlist.length;
    player.src = `${playlist[current].replace("assets/", "")}`;
    if (!isPaused) player.play();
  }

  const playPrevious = () => {
    const isPaused = player.isPaused;
    current = (current - 1 + playlist.length) % playlist.length;
    player.src = `${playlist[current].replace("assets/", "")}`;
    if (!isPaused) player.play();
  }

  const increase = () => {
    let volume = player.volume;
    volume += 0.0083;
    if (volume < 1) {
      player.volume = volume;
      setTimeout(increase, 1000);
      return
    }
    player.volume = 1;
  };

  const alarmPlay = () => {
    player.volume = 0.01;
    player.play();
    increase();
  };

  const play = () => {
    player.volume = 1;
    player.play();
  };

  const pause = () => {
    player.pause();
  };

  const switchShuffle = () => {
    isShuffled = !isShuffled;

    if (!isShuffled) {
      loadPlaylist();
      return
    }
    shuffle(playlist);
  }

  player.addEventListener("ended", () => {
    playNext();
  });

  return {
    alarmPlay,
    play,
    pause,
    playNext,
    playPrevious,
    isShuffled,
    switchShuffle,
    isPlaying: () => !player.paused
  };

})();
