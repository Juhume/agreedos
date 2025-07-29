// -------- CONFIGURACIÓN --------
const targetDate = new Date("2025-08-21T12:00:00") // yyyy-mm-ddThh:mm:ss

let confetiLanzado = false;

// -------- CONTADOR --------
function updateCountdown() {
  const now = new Date()
  let diff = targetDate - now
  if (diff < 0) diff = 0

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  document.getElementById("days").textContent = days
  document.getElementById("hours").textContent = hours
  document.getElementById("minutes").textContent = minutes
  document.getElementById("seconds").textContent = seconds

  // Confeti y mensaje especial al llegar a 0
  if (diff === 0 && !confetiLanzado) {
    lanzarConfetiFinal();
    confetiLanzado = true;
    const h2 = document.querySelector('.countdown h2');
    if(h2) h2.textContent = '¡El acuerdo está en marcha!';
  }
}

setInterval(updateCountdown, 1000)
updateCountdown()

function lanzarConfetiFinal(config = {}) {
  confetti(Object.assign({
    particleCount: 200,
    spread: 110,
    origin: { y: 0.6 },
    scalar: 1.18,
    colors: ['#2d6a4f', '#74c69d', '#8ecae6', '#ffd166', '#f3d9fa']
  }, config));
  setTimeout(() => {
    confetti(Object.assign({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.55 }
    }, config));
  }, 350);
}

// -------- PREVISIÓN DEL TIEMPO --------
function getIcon(desc) {
  const d = desc.toLowerCase()
  if(d.includes("rain") || d.includes("lluvia")) return "🌧️"
  if(d.includes("cloud") || d.includes("nube")) return "☁️"
  if(d.includes("snow") || d.includes("nieve")) return "❄️"
  if(d.includes("sun") || d.includes("soleado") || d.includes("clear")) return "☀️"
  if(d.includes("thunder") || d.includes("tormenta")) return "⛈️"
  return "🌤️"
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function fetchWeather() {
    fetch("https://wttr.in/40.3384,-5.1436?format=j1")
      .then(res => res.json())
      .then(data => {
        const forecast = data.weather.slice(0,3)
        const weatherList = document.getElementById("weather-list")
        weatherList.innerHTML = ""
        forecast.forEach((day, i) => {
          const desc = day.hourly[4].weatherDesc[0].value
          const html = `
            <div class="weather-day">
              <div class="date">${i === 0 ? "Hoy" : i === 1 ? "Mañana" : "Pasado"}</div>
              <div class="icon">${getIcon(desc)}</div>
              <div class="temp"><span>${day.mintempC}°C</span> / <span>${day.maxtempC}°C</span></div>
              <div class="desc">${capitalize(desc)}</div>
            </div>
          `
          weatherList.insertAdjacentHTML("beforeend", html)
        })
        // --- Analiza nubosidad nocturna para la sección de estrellas ---
        analizarEstrellas(data)
      })
      .catch(() => {
        document.getElementById("weather-list").innerHTML = "<p>No se pudo cargar el tiempo.</p>"
        document.getElementById("stargazing-advice").innerHTML =
          `<span class="emoji">⚠️</span><span>Error consultando el clima.</span>`;
      })
  }
fetchWeather()

// --------- SECCIÓN ¿NOCHE DE ESTRELLAS? -------------
function analizarEstrellas(weatherData) {
  try {
    // Tomamos el primer día y el bloque 21:00h (índice 7)
    const noche = weatherData.weather[0].hourly[7];
    const nubosidad = parseInt(noche.cloudcover, 10);

    let mensaje = "", emoji = "";

    if (nubosidad <= 15) {
      mensaje = "¡Cielo despejado, noche perfecta para ver estrellas!";
      emoji = "✨🌌";
    } else if (nubosidad <= 40) {
      mensaje = "Algunas nubes, pero seguro pillamos alguna estrella fugaz.";
      emoji = "🌟⛅";
    } else if (nubosidad <= 70) {
      mensaje = "Bastante nuboso, pero igual se abre algún claro...";
      emoji = "🌥️🔭";
    } else {
      mensaje = "Nublado, mejor dejar el telescopio en la mochila.";
      emoji = "☁️😔";
    }

    document.getElementById("stargazing-advice").innerHTML =
      `<span class="emoji">${emoji}</span><span>${mensaje}</span>`;
  } catch(e) {
    document.getElementById("stargazing-advice").innerHTML =
      `<span class="emoji">❓</span><span>No se pudo analizar la nubosidad nocturna.</span>`;
  }
}

// --------- PARALLAX SUAVE EN MÓVIL -------------
const layers = [
  { class: ".mountains", speed: 35 },
  { class: ".trees", speed: 13 }
];

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY
  layers.forEach(layer => {
    const el = document.querySelector(layer.class)
    if (el) {
      el.style.transform = `translateY(${scrollY / (80 - layer.speed)}px)`
    }
  })
})

// Confeti al pulsar el logo
document.querySelector('.logo').addEventListener('click', function() {
    confetti({
      particleCount: 160,
      spread: 140,
      origin: { y: 0.4 },
      scalar: 1.28,
      colors: ['#74c69d', '#ffd166', '#f3d9fa', '#8ecae6', '#40916c']
    });
});
