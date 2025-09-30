const clock = document.getElementById("clock");
const date = document.getElementById("date");
const weather = document.getElementById("weather");
const background = document.getElementById("background");

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("nl-NL", { hour: '2-digit', minute: '2-digit' });
  date.textContent = now.toLocaleDateString("nl-NL", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

async function updateWeather() {
  try {
    const response = await fetch("https://wttr.in/?format=%C+%t");
    const text = await response.text();
    weather.textContent = text;
  } catch {
    weather.textContent = "Weer niet beschikbaar";
  }
}

function getRandomImageNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function updateBackground() {
  const imgNum = getRandomImageNumber();
  const imgPath = `images/${imgNum}.png`;

  background.onerror = () => {
    const fallbackNum = getRandomImageNumber();
    background.src = `images/${fallbackNum}.png`;
  };

  background.src = imgPath;
}

// Start
updateClock();
updateWeather();
updateBackground();
setInterval(updateClock, 999);
setInterval(updateBackground, 60000); // elke minuut
