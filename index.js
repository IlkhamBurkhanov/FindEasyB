const express = require('express');
const mongoose = require('mongoose')
const category = require('./routes/categories')
const auhtor = require('./routes/authors')
const resource = require('./routes/resources')
mongoose.connect('mongodb://localhost:27017/EasyFind',).then(()=> {
    console.log("Mongodb ga ulanish xosi qilindi...");
}).catch((err)=> {
    console.log("Xatolik yuz berdi: Mongodb ga ulanishda...", err);
})

const app  = express();
app.use(express.json());
app.use("/", category)
app.use('/', auhtor )
app.use('/', resource)



app.get("/" ,(req, res) => {
    res.send("Hello world")
})


const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`${port} chi portni eshitishni boshladim`)
})