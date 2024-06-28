const { NFC } = require("nfc-pcsc"); // Correct way to import NFC
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const nfc = new NFC(); // Create instance of nfc-pcsc

nfc.on("reader", (reader) => {
  console.log(`${reader.reader.name} device attached`);

  reader.on("card", (card) => {
    console.log(`${reader.reader.name} detected card`, card);
    const uid = card.uid.toString("hex");
    io.emit("uid", uid); // Send UID to connected clients
  });

  reader.on("error", (err) => {
    console.error(`Error: ${err}`);
  });

  reader.on("end", () => {
    console.log(`${reader.reader.name} device removed`);
  });
});

nfc.on("error", (err) => {
  console.error(`NFC error: ${err}`);
});

// Serve static files from public directory
app.use(express.static("public"));

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
