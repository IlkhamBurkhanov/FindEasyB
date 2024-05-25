const express = require("express")
const router = express.Router();
const {Author, validate} = require('../models/author')


router.get('/api/authors', async (req,res)=> {
    const authors = await Author.find().sort('name');
    res.send(authors)
})

router.get('/api/authors/:id', async (req, res)=> {
    const auhtors = await Author.findById(req.params.id)
    if(!auhtors){
        return res.status(404).send("Id buyicha qidirilgan auhtor topilmadi")
    }
    res.send(auhtors)
})

router.post('/api/authors', async (req, res)=> {
    const {error} = validate(req.body)
    if(error){
        return res.status(404).send(error.details[0].message)
    }
    let author = new Author({
        name: req.body.name,
        workLocation: req.body.workLocation,
        experience: req.body.experience
    })
    author = await author.save()
    res.status(201).send(author)
})

router.put('/api/authors/:id', async (req, res)=> {
    const author = await Author.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        workLocation: req.body.workLocation,
        experience: req.body.experience
    }, {new: true})
    if(!author){
        res.status(404).send("Kiritilgan ID bo'yicha malumot topilmadi")
    }

    const {error} = validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
       }
    res.send(author)


})
router.delete('/api/authors/:id', async (req, res) => {
    const author = await Author.findByIdAndDelete(req.params.id)
    if(!author){
        return res.status(400).send("Kiritilgan Id tenf bo'lgan category topilmadi")
    }
    res.send(author)
})


module.exports = router