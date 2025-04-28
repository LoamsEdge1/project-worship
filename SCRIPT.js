const audios = [
  document.getElementById('audio1'),
  document.getElementById('audio2'),
  document.getElementById('audio3')
];

window.onload = function() {
  setTimeout(() => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    restoreSettings();
  }, 1000);
};

function playAll() {
  audios.forEach(audio => audio.play());
}
function pauseAll() {
  audios.forEach(audio => audio.pause());
}
function toggleMute(index) {
  const audio = audios[index];
  const button = document.querySelectorAll('.mute-btn')[index];
  audio.muted = !audio.muted;
  button.classList.toggle('active');
  saveSettings();
}
function toggleLoop(index) {
  const audio = audios[index];
  const button = document.querySelectorAll('.loop-btn')[index];
  audio.loop = !audio.loop;
  button.classList.toggle('active');
  saveSettings();
}
function toggleMasterMute() {
  audios.forEach(audio => {
    audio.muted = !audio.muted;
  });
  document.querySelectorAll('.mute-btn').forEach(btn => btn.classList.toggle('active'));
  saveSettings();
}
document.getElementById('masterVolume').addEventListener('input', function() {
  const value = this.value;
  audios.forEach((audio, index) => {
    const individualVolume = document.getElementById('volume' + (index + 1)).value;
    audio.volume = value * individualVolume;
  });
  saveSettings();
});

// Volume sliders
audios.forEach((audio, index) => {
  const slider = document.getElementById('volume' + (index + 1));
  slider.addEventListener('input', function() {
    audio.volume = this.value * document.getElementById('masterVolume').value;
    saveSettings();
  });
  audio.addEventListener('timeupdate', function() {
    const progress = (audio.currentTime / audio.duration) * 100;
    document.getElementById('waveform' + (index + 1)).style.background = `linear-gradient(to right, #00ffd0 ${progress}%, #555 ${progress}%)`;
  });
});

// Save and restore
function saveSettings() {
  const settings = {
    volumes: audios.map((audio, index) => document.getElementById('volume' + (index + 1)).value),
    mutes: audios.map(audio => audio.muted),
    loops: audios.map(audio => audio.loop)
  };
  localStorage.setItem('audioMixerSettings', JSON.stringify(settings));
}
function restoreSettings() {
  const settings = JSON.parse(localStorage.getItem('audioMixerSettings'));
  if (settings) {
    settings.volumes.forEach((vol, index) => {
      document.getElementById('volume' + (index + 1)).value = vol;
      audios[index].volume = vol;
    });
    settings.mutes.forEach((mute, index) => {
      audios[index].muted = mute;
      if (mute) document.querySelectorAll('.mute-btn')[index].classList.add('active');
    });
    settings.loops.forEach((loop, index) => {
      audios[index].loop = loop;
      if (loop) document.querySelectorAll('.loop-btn')[index].classList.add('active');
    });
  }
}
