const socket = io("http://localhost:3000");
let map;
let driverMarker;
let driverPosition = { lat: 37.7749, lng: -122.4194 }; // Default SF location
let routePath;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: driverPosition,
    zoom: 14,
  });

  driverMarker = new google.maps.Marker({
    position: driverPosition,
    map: map,
    title: "Driver Location",
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  });

  socket.on("locationUpdate", (data) => {
    driverPosition = { lat: data.lat, lng: data.lng };
    driverMarker.setPosition(driverPosition);
    map.setCenter(driverPosition);
  });

  socket.on("routeUpdate", (route) => {
    drawRoute(route);
  });
}

function drawRoute(route) {
  if (routePath) routePath.setMap(null); // Remove existing route

  const routeCoords = route.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));

  routePath = new google.maps.Polyline({
    path: routeCoords,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 4,
    map: map,
  });
}

// Simulate driver movement
function simulateMovement() {
  driverPosition.lat += 0.001;
  driverPosition.lng += 0.001;
  socket.emit("updateLocation", driverPosition);
}

window.onload = initMap;
