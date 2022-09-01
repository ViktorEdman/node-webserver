// Dependencies
const express = require('express')
const cors = require('cors')
const path = require('path')

//Import environment variables
require('dotenv').config()

// Express init
const app = express()
app.enable('trust proxy')
// log connections
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`)
    console.log(`${res.statusCode} ${res.statusMessage} - ${req.ip}`)
    next()
})

//Settings
app.set('view engine', 'ejs')

//Port
const port = process.env.port || 30000

//Middleware
app.use(cors())

//'/' renders public/index.html
app.use(express.static('public', { index: ['index.html'] }))

//Enables urlencoded requests to be parsed
app.use(express.urlencoded({ extended: false }))

//Routers
// const articleRouter = require('./routes/articles')
// const apiRouter = require('./routes/api')
const filesRouter = require('./routes/files')
/* 	Routes */

//The server is a teapot, and can not serve coffee.
app.get('/coffee', (req, res) => {
    res.status(418)
    res.json({ Response: `Can't send coffee, I'm a teapot` })
    res.end()
})

app.get('/viktor', (req, res) => res.end('Hej viktor!!'))

app.get('/ip', (req, res) => {
    res.end(
        `This is process id ${process.env.pm_id} on host ${req.connection.localAddress}.
        Your IP is ${req.ip}`
    )
})

// /react/static hosts static files for react frontend
app.use(
    ['/react/static', '/react/static*'],
    express.static(path.join(__dirname, '/public/react/static'))
)

//React frontend is served from /react, all routes point to index.html
app.use(['/react', '/react/*'], (req, res) => {
    res.sendFile(path.join(__dirname, '/public/react/index.html'))
})

app.use('/files', filesRouter)

//HTML blog is served from /articles by articleRouter **DEPRECATED**
/* app.use('/articles', articleRouter) */
//API endpoints are served from /api by apiRouter
// app.use('/api', apiRouter)

//Last match is for 404, since all other options have been exhausted
app.use('*', (req, res, next) => {
    res.sendStatus(404)
    next()
})

/* End routes */

//listen
app.listen(port, '0.0.0.0', () => {
    console.log('HTTP Server running on port ' + port)
})
