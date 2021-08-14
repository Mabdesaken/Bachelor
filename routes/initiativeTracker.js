//Importing information
const express = require('express')
const router = express.Router()
const Initiative = require('../models/initiativeTracker')
const InvItem = require('../models/invItem')

let indexPath = 'initiativeTracker/index'

//Show all initiatives
router.get('/',  async (req, res) => {
    //exporting request information to enable searchoptions in the view
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        //find all the objects from the server, sort it after initiative, and send it to the initiative tracker
        const initiative = await Initiative.find(searchOptions).sort({number: 'desc'}).exec()
        res.render(indexPath, {
            initiativeTracker: initiative,
            searchOptions: req.query
        })
    } catch {
        //if we fail, send us to the homepage
        res.redirect('/')
    }
})

router.get('/new', (req, res) => {
    //Navigating to New Initiative page, where the post request is sent to create a new initiative. Sends an empty object,
    //that the postrequest populates after the user has put information into the text inputs.
    res.render('initiativeTracker/new', { initiativeTracker: new Initiative() })
})

//Create new initiative
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
        //get initiative object from server, by using the id of the page
        const init = await Initiative.findById(req.params.id)
        //find all the items that references this player/initiative to show their inventory
        const items = await InvItem.find({ owner: init.id })
        //tell the view to render to make a view for the object
        res.render('initiativeTracker/show', {
            initiativeTracker: init,
            itemsOfPlayer: items
        })
    } catch {
        //if we couldn't find the object from the server, send us back to frontpage
        res.redirect('/')
    }
})

//Showing edit page for our initiative and user
router.get('/:id/edit', async (req, res) => {
    try {
        //wait for the database to find the id's object before rendering the page
        let initiative = await Initiative.findById(req.params.id)
        //if we found the object, send us to its edit page, and send the object with the response
        res.render('initiativeTracker/edit', {
            initiativeTracker: initiative
        })
    } catch {
        //if we didn't manage to edit properly send us to index
        res.redirect('/initiativeTracker')
    }
})

//Update initiative
router.put('/:id', async (req, res) => {
    //defining init outside of try/catch because we want to access the variable in both scenarios
    let initiative
    try {
        //find the object matching the id on the page, and if we found the object set the new name and initiative from the request
        initiative = await Initiative.findById(req.params.id)
        initiative.name = req.body.name
        initiative.number = req.body.number
        //save the object to mongo
        await initiative.save()
        //we're successful so send us back to the page objects page to view the change
        res.redirect(`/initiativeTracker/${initiative.id}`)
    } catch {
        if(initiative == null) {
            //if we didn't find object -> homepage
            res.redirect('/')
        } else {
            //The imput parameters weren't correct and we are sent back to edit page
            res.render('initiativeTracker/edit',{
                initiativeTracker: initiative,
                errorMessage: 'Error updating initiative'
            })
        }
    }
})

//Delete initiative
router.delete('/:id', async (req, res) => {
    //the delete request is very similar to the updage request, but instead of telling the database to save the changes, we want it to be removed.
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

//exporting the router logic to the server.js app to handle the backend logic
module.exports = router