import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import envVariable from "./config/envVariables.js";

// Express setup
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// DB connection
import mongoose from "mongoose";
mongoose
  .connect(envVariable.MONGO_URI)
  .then(() => {
    console.log("Mongo connection established");
  })
  .catch((error) => {
    console.log("Error while connecting to Database", error);
  });

// Constant variables
const rooms = {};

// Handle WebSocket connection
wss.on("connection", (ws) => {
  let currentRoom = "my-room";
  rooms[currentRoom] = rooms[currentRoom] || [];
  rooms[currentRoom].push(ws);

  console.log(`Client connected to room 0 ${currentRoom}`);

  // Send confirmation that the client is in the default room
  ws.send(JSON.stringify({ message: `Client joined room ${currentRoom}` }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "join-room") {
      const roomId = data.roomId;
      if (rooms[roomId]) {
        rooms[roomId].push(ws);
        currentRoom = roomId;
        console.log(`Client joined room ${roomId}`);
        ws.send(JSON.stringify({ message: `Client joined room ${roomId}` }));
      } else {
        ws.send(JSON.stringify({ error: "Room does not exist" }));
      }
    } else if (data.type === "video-frame") {
      const roomId = currentRoom;
      if (roomId && rooms[roomId]) {
        rooms[roomId].forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(
              JSON.stringify({ type: "video-frame", frame: data.frame })
            );
          }
        });
      }
    }
  });
});

// Api Endpoints
import sensorRoute from "./routes/sensor.route.js";
import authRoute from "./routes/auth.route.js";
import cameraDeviceRoute from "./routes/cameraDevice.route.js";
import breachRoute from "./routes/breach.route.js";
import actionRoute from "./routes/action.route.js";
import sensorDataRoute from "./routes/sensorData.route.js";

app.get("/", (req, res) => {
  res.send("Server is up to date!");
});

app.use("/api/v1", authRoute);
app.use("/api/v1", sensorRoute);
app.use("/api/v1", cameraDeviceRoute);
app.use("/api/v1", breachRoute);
app.use("/api/v1", actionRoute);
app.use("/api/v1", sensorDataRoute);

// listen to server
server.listen(port, () => {
  console.log("Server is running on port : " + port);
});
