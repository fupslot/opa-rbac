import './style.css'


let attempt = 0
let attemptTimeout = null

const max_attempts = 4

function try_socket () {
  // Open a connection. This is a common
  // connection. This will be opened only once.
  const ws = new WebSocket("ws://localhost:8080/channel");
  
  let pingTimeout = null
  ws.onopen = () => {
    attempt = 0

    function ping() {
      ws.send(Date.now())
      pingTimeout = setTimeout(ping, 1000)
    }

    ping()
    
    console.log("ws onopen")
  }
  
  ws.onclose = () => {
    if (pingTimeout) {
      clearTimeout(pingTimeout)
    }
 
    if (attempt == 0 && ws.readyState == 3) {
      if (attempt >= max_attempts) {
        console.log("reached max attempts", max_attempts)
        if (attemptTimeout) clearTimeout(attemptTimeout)
        return
      }
  
      attempt++
      attemptTimeout = setTimeout(try_socket, 2000)
    }

    console.log("ws onclose")
  }
  
  ws.addEventListener("error", (event) => {
    if (pingTimeout) {
      clearTimeout(pingTimeout)
    }

    if (event.currentTarget.readyState > 1 ) {
      if (attempt >= max_attempts) {
        console.log("reached max attempts", max_attempts)
        if (attemptTimeout) clearTimeout(attemptTimeout)
        return
      }
  
      attempt++
      attemptTimeout = setTimeout(try_socket, 2000)
    }

    console.log("error", event)
  })
  
  ws.onmessage = ({ data }) => {
    console.log(data)
  }
}

try_socket()


// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `
