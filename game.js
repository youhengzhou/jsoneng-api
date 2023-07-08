const express = require("express");
const cors = require("cors");
const JDB = require("jsoneng");
const app = express();
const db = new JDB("./jdb");

// while (true) {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send("New data created from game js");
//     }
//   });
// }

server.listen(3002, () => console.log("The websocket on port 3002"));

app.listen(3003, () =>
  console.log("The websocket express is running on port 3003")
);
