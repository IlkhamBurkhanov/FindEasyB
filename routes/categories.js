const express = require('express')
const router = express.Router()
const {  Category, validate} = require('../models/category')


router.get('/api/categories', async (req, res)=> {
    const categories = await Category.find().sort('name')
    res.send(categories)
})
router.get('/api/categories/:id', async (req, res)=> {
    const category = await Category.findById({_id:req.params.id})
    if(!category){
        res.status(400).send("Kiritilgan ID bo'yicha malumot topilmadi")
    }
    res.send(category)
})

router.post('/api/categories', async (req, res) => {
    const {error} = validate(req.body)
    if(error){
       return res.status(404).send(error.details[0].message)
    }

    let category = new Category({
        name: req.body.name,
    
    })
    category = await category.save()
       res.status(201).send(category);
})

router.put('/api/categories/:id', async (req, res)=> {
    const category = await Category.findByIdAndUpdate(req.params.id,{
        name: req.body.name
    }, {new: true})
    if(!category){
        res.status(404).send("Kiritilgan ID bo'yicha malumot topilmadi")
    }

    const {error} = validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
       }
    res.send(category)


})
router.delete('/api/categories/:id', async(req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    if(!category){
        return res.status(404).send("Kiritilgan Id tenf bo'lgan category topilmadi")
    }
    res.send(category)
})

module.exports = router
