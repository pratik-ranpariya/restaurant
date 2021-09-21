const routes = require('./server/routes/index.route')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
var cors = require('cors')
const cronjobs = require('./server/utils/cronjob')
const schedule = require('node-schedule')
const https = require('https')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('dotenv').config()


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('./server'))
app.use(cors())

app.use('/', routes)

cronjobs()

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log('we are live on port ' + port)
})

// mongoose.connect('mongodb://localhost:27017/goDigital', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.connect('mongodb+srv://doadmin:8473zc9yR5fFZ10r@godigital-83757914.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=godigital&tls=true&tlsCAFile=ca-certificate.crt', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connected to MongoDB...', err))
