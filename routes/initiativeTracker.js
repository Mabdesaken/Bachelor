const express = require('express')
const router = express.Router()
const Initiative = require('../models/initiativeTracker')
const InvItem = require('../models/invItem')

let indexPath = 'initiativeTracker/index'

router.get('/',  async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const initiative = await Initiative.find(searchOptions).sort({number: 'desc'}).exec()
        res.render(indexPath, {
            initiativeTracker: initiative,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//Find New Page
router.get('/new', (req, res) => {
    res.render('initiativeTracker/new', { initiativeTracker: new Initiative() })
})

router.post('/', async (req, res) => {
    //Create a new object with the parameters taken from initiativeTracker.ejs view, make it into a variable and test for errors
    let initiative = new Initiative({
        number: req.body.number,
        name: req.body.name
    })
    try {
        let newInitiative = await initiative.save()
        res.redirect(`initiativeTracker/${newInitiative.id}`)
    } catch {
        res.render('initiativeTracker/new',{
            initiativeTracker: initiative,
            errorMessage: 'Error creating initiative'
        })
    }
})

//Show the pages for each user who has initiative
router.get('/:id', async (req, res) => {
    try {
        const init = await Initiative.findById(req.params.id)
        const items = await InvItem.find({ owner: init.id })
        res.render('initiativeTracker/show', {
            initiativeTracker: init,
            itemsOfPlayer: items
        })
    } catch {
        res.redirect('/')
    }
})

//Making edit page for our initiative and user
router.get('/:id/edit', async (req, res) => {
    try {
        let initiative = await Initiative.findById(req.params.id)
        res.render('initiativeTracker/edit', {
            initiativeTracker: initiative
        })
    } catch {
        res.redirect('/initiativeTracker')
    }
})

//Update initiative
router.put('/:id', async (req, res) => {
    let initiative
    try {
        initiative = await Initiative.findById(req.params.id)
        initiative.name = req.body.name
        await initiative.save()
        res.redirect(`/initiativeTracker/${initiative.id}`)
    } catch {
        if(initiative == null) {
            res.redirect('/')
        } else {
            res.render('initiativeTracker/edit',{
                initiativeTracker: initiative,
                errorMessage: 'Error updating initiative'
            })
        }
    }
})

//Delete initiative
router.delete('/:id', async (req, res) => {
    let initiative
    try {
        initiative = await Initiative.findById(req.params.id)
        await initiative.remove()
        res.redirect('/initiativeTracker')
    } catch {
        if(initiative == null) {
            res.redirect('/')
        } else {
            res.redirect(`/initiativeTracker/${initiative.id}`)
        }
    }
})

module.exports = router