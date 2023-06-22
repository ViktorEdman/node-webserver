const express = require('express')
const router = express.Router()
const basicAuth = require('express-basic-auth')

const formidable = require('formidable')
const uploadDirectory = process.cwd() + '/uploaded_files'

const fs = require('fs/promises')

const listDirFiles = async (dir) => {
    const fileList = await fs.readdir(dir)
    const filteredList = fileList.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    return filteredList
}

const authorize = basicAuth({
    users: { admin: '2uNeaeQCJUokB2HYAdWm' },
    challenge: true
})

//Create new file
router.post('/', authorize
    ,
    async (req, res, next) => {

        const form = formidable({
            uploadDir: uploadDirectory
        })

        form.parse(req, async (err, fields, upload) => {
            if (err) {
                next(err)
                return
            }


            try {
                console.log()
                await fs.rename(upload.file.filepath, form.uploadDir + '/' + upload.file.originalFilename)
            } catch (error) {
                next(error)
            }
            res.redirect('/files')
        })
    })

//Display index page
router.get('/', async (req, res) => {
    const files = await listDirFiles('uploaded_files')
    res.render('files/index', { files })
})

//Retrieve a file
router.get('/:filename', async (req, res) => {
    res.download(uploadDirectory + "/" + req.params.filename)
})

router.delete('/:filename', authorize, async (req, res) => {
    const fileName = req.params.filename
    const filePath = `${uploadDirectory}/${fileName}`
    try {
        await fs.unlink(filePath)
        res.status(200).send(JSON.stringify({ message: "Deleted " + fileName }))
    } catch (err) {
        console.log(err)
        res.status(404).send(JSON.stringify({ message: "File not found" }))
    }

})

//list all files

module.exports = router
