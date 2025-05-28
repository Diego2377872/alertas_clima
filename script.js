const map = L.map('map').setView([-25.5, -57.5], 7); // ajusta según tu zona

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Mostrar condiciones actuales del tiempo en Asunción (puedes ajustar ubicación)
fetch('https://api.open-meteo.com/v1/forecast?latitude=-25.3&longitude=-57.6&current=temperature_2m,relative_humidity_2m,weathercode&timezone=auto')
  .then(res => res.json())
  .then(data => {
    const current = data.current;
    const weatherText = `
      <strong>Asunción</strong>: 
      ${current.temperature_2m}°C, 
      Humedad: ${current.relative_humidity_2m}%, 
      Código clima: ${current.weathercode}
    `;
    document.getElementById("weather-info").innerHTML = weatherText;
  });

fetch('data/parcelas.geojson')
  .then(res => res.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      onEachFeature: async (feature, layer) => {
        const coords = feature.geometry.coordinates[0][0];
        const lon = coords[0];
        const lat = coords[1];

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
      }
    }).addTo(map);
  });
