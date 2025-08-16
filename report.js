// Initialize map centered on Delhi
const map = L.map('map').setView([28.6139, 77.2090], 12);

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add search box
L.Control.geocoder().addTo(map);

let tempMarker = null;
let flaggedMarker = null;
let flaggedLocation = null;

// On double-click, ask confirmation to pin
map.on('dblclick', async function (e) {
  const latlng = e.latlng;

  // Get location name from Nominatim
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
  );
  const data = await response.json();
  const locationName = data.display_name || "Unknown Location";

  // Show popup confirmation
  document.getElementById('popup').classList.remove('hidden');
  document.getElementById('popupText').textContent =
    `Do you want to flag this location: ${locationName}?`;

  flaggedLocation = { lat: latlng.lat, lon: latlng.lng, name: locationName };
});

// Popup buttons
document.getElementById('confirmBtn').onclick = function () {
  document.getElementById('popup').classList.add('hidden');

  if (flaggedMarker) {
    map.removeLayer(flaggedMarker);
  }

  flaggedMarker = L.marker([flaggedLocation.lat, flaggedLocation.lon], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [30, 40],
      iconAnchor: [15, 40]
    })
  }).addTo(map).bindPopup(`<b>${flaggedLocation.name}</b>`).openPopup();

  // Show upload section
  document.getElementById('uploadContainer').classList.remove('hidden');
};

document.getElementById('cancelBtn').onclick = function () {
  document.getElementById('popup').classList.add('hidden');
};

// Locate button
document.getElementById('locateBtn').onclick = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 15);
      L.circleMarker([latitude, longitude], { radius: 6, color: "blue" })
        .addTo(map)
        .bindPopup("You are here")
        .openPopup();
    }, function (err) {
      alert("Unable to fetch your location.");
    });
  } else {
    alert("Geolocation not supported.");
  }
};
