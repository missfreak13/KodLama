const socket = io('http://localhost:3000');
let map;
let markers = {};

// Initialize Google Map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.5937, lng: 78.9629 }, // Centered at India
    zoom: 5,
  });
}

// Listen for real-time location updates
socket.on('locationUpdate', (data) => {
  const { driverId, latitude, longitude } = data;

  // Update marker if it exists, else create a new one
  if (markers[driverId]) {
    markers[driverId].setPosition({ lat: latitude, lng: longitude });
  } else {
    markers[driverId] = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: `Driver: ${driverId}`,
    });
  }

  // Center the map on the driver
  map.panTo({ lat: latitude, lng: longitude });
});

// Initialize the map after loading
window.initMap = initMap;
