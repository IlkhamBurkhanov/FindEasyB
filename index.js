require('dotenv').config(); // .env ni yuklash

const express = require('express');
const mongoose = require('mongoose');

const category = require('./routes/categories');
const author = require('./routes/authors'); // ✅ 'auhtor' ni 'author' ga o'zgartirdim
const resource = require('./routes/resources');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8000;

// MongoDB Atlas-ga ulanib olish
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Mongodb Atlas-ga ulanish amalga oshirildi..."))
    .catch((err) => console.error("❌ MongoDB ulanishida xatolik:", err));

app.use("/", category);
app.use("/", author);
app.use("/", resource);

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portda ishga tushdi...`);
});
