const broadcastChannel = new BroadcastChannel("WebSocketChannel")

let attempt = 0
let attemptTimeout = null

const max_attempts = 4
let ws
function try_socket () {
  // Open a connection. This is a common
  // connection. This will be opened only once.
  ws = new WebSocket("ws://localhost:8080/channel");
  
  let pingTimeout = null
  ws.addEventListener("open", () => {
    attempt = 0


    function ping() {
        ws.send(Date.now())
        pingTimeout = setTimeout(ping, 1000)
    }

    ping()
    
    broadcastWSStateChange(ws)
    console.log("ws onopen")
  })
  
  ws.addEventListener("close", () => {
    if (pingTimeout) {
      clearTimeout(pingTimeout)
    }
 
    if (attempt == 0 && ws.readyState == 3) {
        re_try(ws)
    }

    broadcastWSStateChange(ws)
    console.log("ws onclose")
  })
  
  ws.addEventListener("error", (event) => {
    if (pingTimeout) {
      clearTimeout(pingTimeout)
    }

    if (ws.readyState > 1 ) {
        re_try(event.currentTarget)
    }
    broadcastWSStateChange(ws)
  })
  
  ws.addEventListener("message", ({ data }) => {
    broadcastChannel.postMessage(data)
  })
}

function re_try(ws) {
    if (attempt >= max_attempts) {
        onsole.log("reached max attempts", max_attempts)
        if (attemptTimeout) clearTimeout(attemptTimeout)
        return
    }

    attempt++
    attemptTimeout = setTimeout(try_socket, 2000)

}

function broadcastWSStateChange(ws) {
    broadcastChannel.postMessage({ satte: ws.readyState, type: "WSState" })
}

try_socket()



onconnect = evt => {
    // Get the MessagePort from the event. This will be the
    // communication channel between the SharedWorker and the Tab
    const port = evt.ports[0]
    port.onmessage = (msg) => {
        if (msg.type === "PortWelcome") {
            // gateLink.addGate(port, msg.data.from)
        }

        if (msg.type === "PortBye") {
            // gateLink.removeGate(port, msg.data.from)
        }

        // forward the message to the websocket channel
        if (msg.type === "PortMessage") {
            ws.send(msg.data)
        }
    }

    // Here we notify new connected port to know the state of WS channels
    // port.postMessage({ state: null, type: "ChannelState" })
    if (ws) {
        port.postMessage({ state: ws.readyState, type: "WSState"})
    }
}
