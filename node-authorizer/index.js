const express = require('express')
const logger = require('pino')({ name: 'authorizer' })
const http = require('http')

const main = async() => {
    const app = express()
    const server = http.createServer(app)

    app.use((req,res, next) => {
        logger.info({
            url: req.url,
            headers: req.headers
        })
        next()
    })

    app.get('/enforce', (req, res) => {
        // Make request to OPA ensure that the incoming request is legitite 
        res.set('x-auth-identity', "anonymous")
        res.sendStatus(401)
        // res.json({
        //     url: req.url,
        //     headers: req.headers
        // })        
    })

    app.get("/api/", (req, res) => {
        res.json({
            url: req.url,
            headers: req.headers
        })
    })


    server.listen(9000, () => {
        logger.info(`Listening on port 9000`)
    })


}

main().catch((error) => {
    logger.error(error)
})