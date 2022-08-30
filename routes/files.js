const express = require('express')
const router = express.Router()
const basicAuth = require('express-basic-auth')

const fs = require('fs/promises')

router.use((basicAuth({
    users: { 'mongo': 'derpderp' },
    challenge: true
})))


//Display index page
router.get("/", async (req, res) => {
    console.log(await fs.readdir("uploaded_files"))
    res.render('files/index')
})

//Create new file
router.post('/', async (req,res) => {

}) 

//Retrieve a file


//list all files

module.exports = router