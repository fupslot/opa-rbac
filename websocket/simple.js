const ws = require("ws");

const wss = new ws.WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
    ws.send(`Got ${data}`);
  });

  ws.send("something");
});
