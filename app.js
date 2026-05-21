const looks = [
  {
    title: "原始造型",
    caption: "这是吴旻昊aka我的宝宝，外院数一数二的大美女，但是我画技有限，多多体谅555。",
    accent: "#2c3442",
    sticker: null,
  },
  {
    title: "纽约棒球帽",
    caption:
      "宝宝我们刚认识的时候，你就带着这个蓝色棒球帽，算是经典皮肤了哈哈哈哈。那个时候我还没有喜欢你呢，但是宝宝，你已经吸引到我的注意力了v-v",
    accent: "#18365f",
    sticker: {
      src: "./assets/stickers/cap-fitted.png",
      alt: "深蓝棒球帽",
      left: 30.7,
      top: -1.8,
      width: 36,
      rotate: 0,
    },
  },
  {
    title: "小黑龙发夹",
    caption:
      "我们看的第一场电影，虽然是奇幻的风格，但是居然有感情线。我也想成为拯救世界的英雄，然后和你在一起。",
    accent: "#7e9d24",
    sticker: {
      src: "./assets/stickers/dragon.png",
      alt: "小黑龙发夹",
      left: 45.7,
      top: 6.9,
      width: 22,
      rotate: -2,
    },
  },
  {
    title: "云朵白犬",
    caption: "我们在假期也约会，你专门路过深圳找我，我可开心了。我们去了萨摩耶咖啡馆，我们第一次坐的那么近。",
    accent: "#9f7442",
    sticker: {
      src: "./assets/stickers/dog.png",
      alt: "白色小狗",
      left: 25.3,
      top: 54,
      width: 44.5,
      rotate: 0,
    },
  },
  {
    title: "黄色潜水镜",
    caption:
      "这是我们期待了一个学期的海岛之旅，宝宝，我真的好开心。在寒冷的冬天和你度过了这么火热的一个旅程。我们都又了很多新鲜的第一次体验。",
    accent: "#d3c800",
    sticker: {
      src: "./assets/stickers/goggles.png",
      alt: "黄色潜水镜",
      left: 30.3,
      top: 6.7,
      width: 37.5,
      rotate: 0,
    },
  },
  {
    title: "红珠花冠",
    caption: "这是我们刚刚去的延边，很遗憾我们没有拍上照片，但是宝宝你是一园子里最好看的公主。宝宝，我们的故事会一直书写。",
    accent: "#b91f24",
    sticker: {
      src: "./assets/stickers/headdress.png",
      alt: "红珠花冠",
      left: 28.8,
      top: 7.3,
      width: 39.5,
      rotate: 0,
    },
  },
];

const stage = document.querySelector("#stage");
const portraitFrame = document.querySelector(".portrait-frame");
const stickerImage = document.querySelector("#stickerImage");
const lookCopy = document.querySelector("#lookCopy");
const lookIndex = document.querySelector("#lookIndex");
const lookCaption = document.querySelector("#lookCaption");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const endingVideo = document.querySelector("#endingVideo");
const bgMusic = document.querySelector("#bgMusic");
const musicButton = document.querySelector("#musicButton");

let currentIndex = 0;
let pointerStartX = 0;
let pointerStartY = 0;
let copyTimer = 0;
let userTriedMusic = false;
const endingIndex = looks.length;

function padIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function percent(value) {
  return `${Number(value).toFixed(1)}%`;
}

function degree(value) {
  return `${Number(value).toFixed(1)}deg`;
}

function setStageVariable(name, value) {
  stage.style.setProperty(name, value);
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function updateText(look, index, delay = 0) {
  window.clearTimeout(copyTimer);
  lookCopy.hidden = false;
  lookCopy.classList.add("is-hidden");
  lookCopy.classList.remove("is-floating");

  copyTimer = window.setTimeout(() => {
    lookIndex.textContent = `${padIndex(index)} / ${String(looks.length).padStart(2, "0")}`;
    lookCaption.textContent = look.caption;
    lookCopy.classList.remove("is-hidden");
    restartAnimation(lookCopy, "is-floating");
  }, delay);
}

function applySticker(look, direction, animate) {
  if (!look.sticker) {
    stickerImage.hidden = true;
    stickerImage.removeAttribute("src");
    stickerImage.classList.remove("is-entering");
    return 80;
  }

  const sticker = look.sticker;
  setStageVariable("--sticker-left", percent(sticker.left));
  setStageVariable("--sticker-top", percent(sticker.top));
  setStageVariable("--sticker-width", percent(sticker.width));
  setStageVariable("--sticker-rotate", degree(sticker.rotate));
  setStageVariable("--from-x", direction === "left" ? "-82vw" : "82vw");
  setStageVariable("--from-y", "0");
  setStageVariable("--from-rotate", direction === "left" ? "-8deg" : "8deg");

  stickerImage.src = sticker.src;
  stickerImage.alt = sticker.alt;
  stickerImage.hidden = false;

  if (animate) {
    restartAnimation(stickerImage, "is-entering");
  } else {
    stickerImage.classList.remove("is-entering");
  }

  return animate ? 700 : 0;
}

function updateButtons() {
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === endingIndex;
}

function hideEndingVideo() {
  endingVideo.pause();
  endingVideo.hidden = true;
  endingVideo.classList.remove("is-visible", "is-frozen");
  endingVideo.currentTime = 0;
  stage.classList.remove("is-video-page");
  portraitFrame.hidden = false;
  lookCopy.hidden = false;
}

async function showEndingVideo() {
  window.clearTimeout(copyTimer);
  currentIndex = endingIndex;
  updateButtons();
  lookCopy.classList.add("is-hidden");
  lookCopy.hidden = true;
  stickerImage.hidden = true;
  stickerImage.removeAttribute("src");
  stage.classList.add("is-video-page");
  portraitFrame.hidden = true;

  endingVideo.hidden = false;
  endingVideo.classList.remove("is-frozen");
  endingVideo.currentTime = 0;
  endingVideo.muted = true;
  restartAnimation(endingVideo, "is-visible");

  try {
    await endingVideo.play();
  } catch {
    // The video is muted, but if a browser still blocks it the first frame remains visible.
  }
}

function setLook(index, direction = "right", animate = true) {
  const nextIndex = Math.max(0, Math.min(index, endingIndex));
  if (nextIndex === endingIndex) {
    showEndingVideo();
    return;
  }

  hideEndingVideo();
  const look = looks[nextIndex];

  currentIndex = nextIndex;
  document.documentElement.style.setProperty("--accent", look.accent);
  document.documentElement.style.setProperty("--accent-soft", `${look.accent}21`);

  const copyDelay = applySticker(look, direction, animate);
  updateText(look, nextIndex, copyDelay);
  updateButtons();
}

function go(delta) {
  tryStartMusic();
  const targetIndex = currentIndex + delta;
  if (targetIndex < 0 || targetIndex > endingIndex) {
    return;
  }

  setLook(targetIndex, delta > 0 ? "right" : "left");
}

setLook(0, "right", false);
updateButtons();

function syncMusicButton() {
  const isPlaying = !bgMusic.paused;
  musicButton.classList.toggle("is-playing", isPlaying);
  musicButton.setAttribute("aria-label", isPlaying ? "暂停背景音乐" : "播放背景音乐");
}

async function tryStartMusic() {
  if (userTriedMusic || !bgMusic.paused) {
    return;
  }

  userTriedMusic = true;

  try {
    await bgMusic.play();
  } catch {
    userTriedMusic = false;
  }

  syncMusicButton();
}

async function toggleMusic() {
  if (bgMusic.paused) {
    userTriedMusic = true;
    try {
      await bgMusic.play();
    } catch {
      userTriedMusic = false;
    }
  } else {
    bgMusic.pause();
  }

  syncMusicButton();
}

prevButton.addEventListener("click", () => go(-1));
nextButton.addEventListener("click", () => go(1));
musicButton.addEventListener("click", toggleMusic);
bgMusic.addEventListener("play", syncMusicButton);
bgMusic.addEventListener("pause", syncMusicButton);
endingVideo.addEventListener("ended", () => {
  endingVideo.classList.add("is-frozen");
  endingVideo.pause();
});

stage.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    go(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    go(1);
  }
});

stage.addEventListener("pointerdown", (event) => {
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
});

stage.addEventListener("pointerup", (event) => {
  const deltaX = event.clientX - pointerStartX;
  const deltaY = event.clientY - pointerStartY;

  if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) {
    tryStartMusic();
    return;
  }

  go(deltaX < 0 ? 1 : -1);
});
