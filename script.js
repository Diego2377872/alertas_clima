const map = L.map('map').setView([-25.5, -57.5], 7); // Ajustar vista inicial

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Función para agregar marcador con clima actual
function agregarClima(lat, lon, nombre) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weathercode&timezone=auto`)
    .then(res => res.json())
    .then(data => {
      const current = data.current;
      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(`
        <b>${nombre}</b><br/>
        🌡️ Temp: ${current.temperature_2m}°C<br/>
        💧 HR: ${current.relative_humidity_2m}%<br/>
        ☁️ Código: ${current.weathercode}
      `);
    });
}

// Agregar condiciones actuales en ciudades del país
const ciudades = [
  { nombre: "Asunción", lat: -25.3, lon: -57.6 },
  { nombre: "Encarnación", lat: -27.3, lon: -55.9 },
  { nombre: "Pedro Juan Caballero", lat: -22.5, lon: -55.7 },
  { nombre: "Filadelfia", lat: -22.3, lon: -60.0 },
  { nombre: "Ciudad del Este", lat: -25.5, lon: -54.6 },
];

ciudades.forEach(c => agregarClima(c.lat, c.lon, c.nombre));

// Cargar parcelas y colorear según HR proyectada
fetch('data/parcelas.geojson')
  .then(res => res.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      onEachFeature: async (feature, layer) => {
        const coords = feature.geometry.coordinates[0][0];
        const lon = coords[0];
        const lat = coords[1];

        try {
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m&forecast_days=3&timezone=auto`);
          const data = await response.json();

          const hr = data.hourly.relative_humidity_2m;
          const avg = hr.reduce((a, b) => a + b, 0) / hr.length;

          if (avg >= 80) {
            layer.setStyle({ color: 'red', fillColor: 'red', fillOpacity: 0.6 });
          } else {
            layer.setStyle({ color: 'green', fillColor: 'green', fillOpacity: 0.2 });
          }

          layer.bindPopup(`<b>HR promedio (3 días):</b> ${avg.toFixed(1)}%`);
        } catch (err) {
          console.error("Error al obtener datos:", err);
          layer.setStyle({ color: 'gray' });
        }
      }
    }).addTo(map);
  });
