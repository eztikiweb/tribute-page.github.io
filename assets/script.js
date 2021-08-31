gsap.registerPlugin(ScrollTrigger);

const pageContainer = document.querySelector(".container");

/* SMOOTH SCROLL */
const scroller = new LocomotiveScroll({
  el: pageContainer,
  smooth: true
});

scroller.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(pageContainer, {
  scrollTop(value) {
    return arguments.length
      ? scroller.scrollTo(value, 0, 0)
      : scroller.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  pinType: pageContainer.style.transform ? "transform" : "fixed"
});

////////////////////////////////////
////////////////////////////////////
window.addEventListener("load", function () {
  let pinBoxes = document.querySelectorAll(".pin-wrap > *");
  let pinWrap = document.querySelector(".pin-wrap");
  let pinWrapWidth = pinWrap.offsetWidth;
  let horizontalScrollLength = pinWrapWidth - window.innerWidth;

  // Pinning and horizontal scrolling

  gsap.to(".pin-wrap", {
    scrollTrigger: {
      scroller: pageContainer, //locomotive-scroll
      scrub: true,
      trigger: "#sectionPin",
      pin: true,
      // anticipatePin: 1,
      start: "top top",
      end: pinWrapWidth
    },
    x: -horizontalScrollLength,
    ease: "none"
  });

  ScrollTrigger.addEventListener("refresh", () => scroller.update()); //locomotive-scroll

  ScrollTrigger.refresh();
});

/*play*/

const image = document.querySelector('#cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const background = document.getElementById("background");

// Music
const songs = [
  {
    path: 'https://github.com/eztikiweb/tribute-page.github.io/blob/main/music/The%20Doors%20Live%201968%20(64%20kbps).mp3?raw=true',
    displayName: 'The Doors live',
    artist: '1967-1968',
    cover: "img/cover.jpg",
  },
  {
    path: 'https://github.com/eztikiweb/tribute-page.github.io/blob/main/music/The%20Door%20s%20Strange%20Days%20Full%20Album%201967%20(64%20kbps).mp3?raw=true',
    displayName: 'Strange Days',
    artist: '1967',
    cover: "img/Strange Days.jpg",
  },
  {
    path: 'https://github.com/eztikiweb/tribute-page.github.io/blob/main/music/WAITIN%20G%20FOR%20THE%20SUN%20-%20FULL%20ALBUM%20-%20(1968)%20(64%20kbps).mp3?raw=true',
    displayName: 'Waiting for the Sun',
    artist: '1968',
    cover: "img/Waiting_for_the_Sun.jpg",
  },
  {
    path: 'https://github.com/eztikiweb/tribute-page.github.io/blob/main/music/The%20Soft%20Parade%20(320%20kbps).mp3?raw=true',
    displayName: 'The Soft Parade',
    artist: '1969',
    cover: "img/The_Soft_Parade.jpg",
  },
  {
    path: 'https://github.com/eztikiweb/tribute-page.github.io/blob/main/music/The%20Doors%20-%20Morrison%20Hotel%20(1970)%20(Full%20Album)%20(64%20kbps).mp3?raw=true',
    displayName: 'Morrison Hotel',
    artist: '1970',
    cover: "img/Morrison_Hotel.jpg",
  },
    {
    path: 'https://github.com/eztikiweb/tribute-page.github.io/blob/main/music/Th%CC%B2e%20Do%CC%B2o%CC%B2rs%20-L%CC%B2%20%CC%B2A%CC%B2%20W%CC%B2oman%20Full%20Album%201971%20(64%20kbps).mp3?raw=true',
    displayName: 'L.A. Woman',
    artist: '1971',
    cover: "img/L.A._Woman.jpg",
  },
];

// Check if Playing
let isPlaying = false;

// Play
function playSong() {
  isPlaying = true;
  playBtn.classList.replace('fa-play', 'fa-pause');
  playBtn.setAttribute('title', 'Pause');
  music.play();
}

// Pause
function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
  music.pause();
}

// Play or Pause Event Listener
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));

// Update DOM
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = song.path;
  changeCover(song.cover);
}

function changeCover(cover) {
  image.classList.remove('active');
  setTimeout(() => {
    image.src = cover;
    image.classList.add('active');
  }, 100)
  background.src = cover;
} 

// Current Song
let songIndex = 0;

// Previous Song
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// Next Song
function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// On Load - Select First Song
loadSong(songs[songIndex]);

// Update Progress Bar & Time
function updateProgressBar(e) {
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    // Calculate display for duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    // Delay switching duration Element to avoid NaN
    if (durationSeconds) {
      durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
    // Calculate display for currentTime
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}

// Set Progress Bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
}

// Event Listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);
