const express = require('express')
const router = express.Router()
const invItems = require('../models/invItem')
const initiativeTracker = require('../models/initiativeTracker')

let indexPath = 'invItems/index'

//This router is very similar to the initiativeTracker, but takes in more information that the initiative model.
//Has less functionality as a result of lack of time, although the initiative tracker has the needed logic.

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
            searchOptions: req.query,
        })
    } catch {
        res.redirect('/')
    }
})

//Send back New inventoryItem view
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
        //saving the new item to the database
        const newItem = await IT.save()
        //doesn't have the necessary functionality yet to render a view with the inventory's id
        //res.redirect(`invItems/${newItem.id}`)
        res.redirect(`invItems`)
    } catch {
        //if it fails to save due to type errors, send back an error message
        await renderNewPage(res, IT, true)
    }
})

//Helps
async function renderNewPage(res, item, hasError = false) {
    try {
        //Takes both an initiative object and a invItem
        const initiatives = await initiativeTracker.find({})
        const params = {
            initiativeTracker: initiatives,
            invItems: item
        }
        //send back errormessage if the parameters aren't right.
        if (hasError) params.errorMessage = 'Error Creating invItems'
        res.render('invItems/new', params)
    } catch {
        res.redirect('/invItems')
    }
}

module.exports = router