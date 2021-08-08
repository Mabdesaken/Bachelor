if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

//Mongo db connection setup
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//Setting up index router for root off app
const indexrouter = require('./routes/index')
const ITRouter = require('./routes/initialTracker')

//views and layout settings
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

//app utility
app.use(expressLayouts)
app.use(express.static('public'))

//Telling app to use routes that are setup
app.use('/', indexrouter)
app.use('/initialTracker', ITRouter)

app.listen(process.env.PORT || 3003)