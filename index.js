const express = require("express");
const cors = require("cors");
const JDB = require("jsoneng");
const app = express();
const db = new JDB("./jdb");
const http = require("http");
const server = require("http").createServer(app);
const WebSocket = require("ws");

app.use(express.json());
app.use(cors());

const wss = new WebSocket.Server({ server });

app.get("/wait", async (req, res) => {
  try {
    let time = 0;
    async function sendData() {
      wss.clients.forEach(async (client) => {
        if (client.readyState === WebSocket.OPEN) {
          const data = await db.read(req.query.dirname);

          console.log(data);

          console.log("we are now sending data to client");
          time += 1;
          console.log(time);

          client.send(JSON.stringify(data));
        }
      });
    }
    let i = 0;
    while (i < 1000) {
      setTimeout(sendData, 5000);
      i += 1;
    }
  } catch (error) {}
});

app.post("/create", async (req, res) => {
  try {
    await db.create(req.body, req.query.dirname);
    res.status(200).send("Data created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/read", async (req, res) => {
  try {
    const data = await db.read(req.query.dirname);

    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send("New data created from game js");
    //   }
    // });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/update", async (req, res) => {
  try {
    await db.update(req.body, req.query.dirname);
    res.status(200).send("Data updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch("/patch", async (req, res) => {
  try {
    await db.patch(req.body, req.query.dirname);
    res.status(200).send("Data patched successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/delete", async (req, res) => {
  try {
    await db.delete(req.query.dirname);
    res.status(200).send("Data deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

server.listen(3002, () => console.log("The websocket on port 3002"));

app.listen(3000, () =>
  console.log("The jsoneng API wrapper is running on port 3000")
);
