const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let driverLocation = { lat: 37.7749, lng: -122.4194 }; // Default Location: SF

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("locationUpdate", driverLocation);

  socket.on("updateLocation", async (newLocation) => {
    driverLocation = newLocation;
    io.emit("locationUpdate", driverLocation);

    // Fetch optimized route using OSRM
    const route = await getRoute(newLocation, { lat: 37.7884, lng: -122.4076 });
    io.emit("routeUpdate", route);
  });
});

async function getRoute(start, end) {
  try {
    const response = await axios.get(
      `http://localhost:5000/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}

server.listen(3000, () => console.log("Server running on port 3000"));
