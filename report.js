// Initialize Map
const map = L.map("map").setView([28.6139, 77.2090], 13); // Default Delhi

// OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Keep track of markers
let markers = [];

// Search
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchBox").value;
  if (!query) return;

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([lat, lon], 15);
        const marker = L.marker([lat, lon]).addTo(map)
          .bindPopup(`📍 ${query}`)
          .openPopup();
        markers.push(marker);
      } else {
        alert("Location not found!");
      }
    })
    .catch(() => alert("Error searching location!"));
});

// Find My Location
document.getElementById("locateBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported!");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 15);
    const marker = L.marker([latitude, longitude]).addTo(map)
      .bindPopup("You are here")
      .openPopup();
    markers.push(marker);
  }, () => alert("Unable to retrieve location!"));
});

// Report Form
const reportForm = document.getElementById("reportForm");
let flaggedMarker = null;

// When user clicks map → ask confirmation
map.on("click", e => {
  if (confirm("Are you sure you want to flag this area?")) {
    if (flaggedMarker) map.removeLayer(flaggedMarker);

    flaggedMarker = L.marker(e.latlng).addTo(map)
      .bindPopup(" Flagged Area")
      .openPopup();

    // Show report form
    reportForm.classList.remove("hidden");
  }
});

// Submit Report
document.getElementById("submitReport").addEventListener("click", () => {
  const desc = document.getElementById("description").value;
  const file = document.getElementById("imageUpload").files[0];
  
  if (!desc || !file) {
    alert("Please upload an image and add a description!");
    return;
  }

  alert("✅ Report submitted successfully!");
  reportForm.classList.add("hidden");
  document.getElementById("description").value = "";
  document.getElementById("imageUpload").value = "";
});

// Cancel Report
document.getElementById("cancelReport").addEventListener("click", () => {
  reportForm.classList.add("hidden");
});
