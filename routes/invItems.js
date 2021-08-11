const express = require('express')
const router = express.Router()
const invItems = require('../models/invItem')
const initiativeTracker = require('../models/initiativeTracker')

let indexPath = 'invItems/index'

//All inventory items route
router.get('/',  async (req, res) => {
    let query = invItems.find()
    if (req.query.owner != null && req.query.owner !== '') {
        query = query.regex('owner', new RegExp(req.query.owner, 'i'))
    }
    if (req.query.name != null && req.query.name !== '') {
        query = query.regex('name', req.query.name)
    }
    try {
        const items = await query.exec()
        res.render(indexPath, {
            invItems: items,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New inventory Item route
router.get('/new', async(req, res) => {
    await renderNewPage(res, new invItems())
})

//Create new inventory item
router.post('/',  async(req, res) => {
    //we're gonna start by making our item
    const IT = new invItems({
        name: req.body.name,
        owner: req.body.owner,
        weight: req.body.weight,
        amount: req.body.amount,
        magical: req.body.magical,
        description: req.body.description
    })
    try {
        const newItem = await IT.save()
        //res.redirect(`invItems/${newItem.id}`)
        res.redirect(`invItems`)
    } catch {
        await renderNewPage(res, IT, true)
    }
})

async function renderNewPage(res, item, hasError = false) {
    try {
        const initiatives = await initiativeTracker.find({})
        const params = {
            initiativeTracker: initiatives,
            invItems: item
        }
        if (hasError) params.errorMessage = 'Error Creating invItems'
        res.render('invItems/new', params)
    } catch {
        res.redirect('/invItems')
    }
}

module.exports = router