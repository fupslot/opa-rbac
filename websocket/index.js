const http = require("http");
const ws = require("ws");
const url = require("url");

const server = http.createServer();
const wss = new ws.WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("Received message", data.toString());
    ws.send(`Got ${data}`);
  });
});

server.on("upgrade", (request, socket, head) => {
  const { pathname } = url.parse(request.url);

  if (pathname == "/channel") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
    return;
  }

  console.log("unrecognized request");
  socket.destroy();
});

server.listen(8080, "localhost", () => {
  console.log("Listen on port 8080");
});
