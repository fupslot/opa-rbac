import { v4 } from "uuid"

const id = v4()
const worker = new SharedWorker("SharedWorker.js", {
    name: "AAAA-websocket-worker-v1-61d8ef46-76ae-421e-9783-a948ea125e78"
})
console.log(`Initializing the web worker for user: ${id}`)

// Connecting to shared worker
worker.port.start()

worker.port.addEventListener("message", (evt) => {
    console.log("data", evt.data)
})


const broadcastChannel = new BroadcastChannel("WebSocketChannel")
broadcastChannel.addEventListener("message", (evt) => {
    console.log("broadcasted", evt.data)
})

worker.port.postMessage({
    from: id,
    type: "PortWelcome"
})

window.addEventListener("beforeunload", () => {
    worker.port.postMessage({
        from: id,
        type: "PortBye"
    })
})