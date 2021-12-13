const express = require('express')
const logger = require('pino')({ name: 'authorizer' })
const http = require('http')
const fetch = require('node-fetch')

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

    // Upstream proxies such as Nginx use this endpoint to ensure that
    // the original request is legit.
    // In this request we query OPA policy verifying an authenticity of 
    // a caller and its permissions to access the requested resource.
    app.get('/enforce', (req, res) => {
        const originalProto = req.get('x-forwarded-proto')
        const originalHost = req.get('x-forwarded-host')
        const baseUrl = `${originalProto}://${originalHost}`
        const originalUri = new URL(req.get('x-original-uri'), baseUrl)

        console.log(originalUri)
        const [_, ...path] = originalUri.pathname.split('/')
        console.log("path", path)

        let token = "none"
        if (req.get('authorization')) {
            token = req.get('authorization').split('Bearer ')[1]
        }

        const input = {
            method: req.get('x-original-method'),
            path,
            token
        }

        // Make request to OPA ensure that the incoming request is legitite 
        fetch(`${process.env['OPA_ENDPOINT']}`, {
            method: 'post',
            body: JSON.stringify({ input }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => {
            logger.info(data)
            res.set('x-auth-identity', "authorized")
            res.set('x-auth-decision-id', data.decision_id)
            
            res.sendStatus(!data.result ? 401 : 200)
        }).catch((error) => {
            res.sendStatus(401)
        })
    })

    app.get("*", (req, res) => {
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