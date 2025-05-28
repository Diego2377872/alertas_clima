<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mapa de Alertas por Humedad</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <header>
    <h1>🌾 Mapa de Alertas por Humedad Relativa</h1>
    <p>Se resaltan en <strong>rojo</strong> las parcelas con probabilidad de HR ≥ 80% en los próximos 3 días.</p>
    <div id="weather-info">Cargando condiciones actuales...</div>
  </header>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="script.js"></script>
</body>
</html>
