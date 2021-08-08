const express = require('express')
const router = express.Router()
const Initiative = require('../models/initiative')

let indexPath = 'initiativeTracker/index'


router.get('/',  async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const initiative = await Initiative.find(searchOptions)
        res.render(indexPath, {
            initiativeTracker: initiative,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    res.render(indexPath)
})

router.get('/new', (req, res) => {
    res.render('initiativeTracker/new', { initiative: new Initiative() })
})

router.post('/', async (req, res) => {
    //Create a new object with the parameters taken from initiativeTracker.ejs view, make it into a variable and test for errors
    let initiative = new Initiative({
        number: req.body.number,
        name: req.body.name
    })
    try {
        let newInitiative = await initiative.save()
        res.redirect(`initiativeTracker`)


    } catch {
        res.render('initiativeTracker/new',{
            initiative: initiative,
            errorMessage: 'Error creating initiative'
        })
    }
})

module.exports = router