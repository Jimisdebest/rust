const MAX_IMAGES = 1000;
const LOAD_TIMEOUT = 5000;
const images = [];

// Laadt een afbeelding met timeout
function loadImageWithTimeout(url, timeout) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let timer = setTimeout(() => {
      img.onload = img.onerror = null;
      reject(new Error('timeout'));
    }, timeout);

    img.onload = () => {
      clearTimeout(timer);
      resolve(url);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error('error'));
    };

    img.src = url;
  });
}

// Preload 1.jpg / 1.png … 1000.jpg / 1000.png
async function preloadImages() {
  for (let i = 1; i <= MAX_IMAGES; i++) {
    try {
      const found = await Promise.race([
        loadImageWithTimeout(`${i}.jpg`, LOAD_TIMEOUT),
        loadImageWithTimeout(`${i}.png`, LOAD_TIMEOUT),
      ]);
      images.push(found);
    } catch (err) {
      // Niet gevonden binnen 5s of fout, overslaan
    }
  }
}

// Achtergrond zetten
function setBackground(url) {
  document.body.style.backgroundImage = `url('${url}')`;
}

// Varieer elke minuut van afbeelding
function rotateBackground() {
  if (!images.length) return;
  const idx = Math.floor(Math.random() * images.length);
  setBackground(images[idx]);
}

// Klok updaten
function updateTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('time').textContent = `${hh}:${mm}:${ss}`;

  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString('nl-NL', opts);
}

// Temperatuur ophalen (voorbeeld: Noordwijk-Binnen)
async function updateTemperature() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=52.2350&longitude=4.4576&current_weather=true'
    );
    const json = await res.json();
    const temp = json.current_weather?.temperature;
    if (temp !== undefined) {
      document.getElementById('temp').textContent = `${temp}°C`;
    }
  } catch (e) {
    console.warn('Weer ophalen mislukt', e);
  }
}

// Search op Bing bij Enter
document.getElementById('search-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = encodeURIComponent(e.target.value.trim());
    if (query) {
      window.location.href = `https://www.bing.com/search?q=${query}`;
    }
  }
});

// Initialisatie
(async () => {
  updateTime();
  updateTemperature();
  setInterval(updateTime, 1000);
  setInterval(updateTemperature, 600000);

  await preloadImages();
  rotateBackground();
  setInterval(rotateBackground, 60000);
})();
