const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

//Setting up index router for root off app
const indexrouter = require('./routes/index')

//views and layout settings
app.set('view engine', 'ejs')
app.set('views', './views')
app.set('layout', 'layouts/layout')

//app utility
app.use(expressLayouts)
app.use(express.static('public'))

//Telling app to use routes that are setup
app.use('/', indexrouter)

app.listen(process.env.PORT || 3003)