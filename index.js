if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const statusRoutes = require('./routes/status'); // Import the status routes
const author = require('./routes/authors');
const resource = require('./routes/resources');
const progress = require('./routes/progress');

const app = express();
app.use(express.json());

// ✅ Enable CORS (Allow all origins temporarily)
app.use(cors());

// ✅ Allow specific origins (Recommended for production)
// app.use(cors({
//     origin: "https://your-frontend-domain.com",
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: "Content-Type,Authorization"
// }));

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ilkhamburkhonov:yfANUzN7sMadCnYE@cluster0.lm9j4.mongodb.net/Cluster0?retryWrites=true&w=majority";
const PORT = process.env.PORT || 8000;

// ✅ MongoDB Atlas connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Atlas connected successfully..."))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Use Routes
// app.use("/", category);
app.use("/", author);
app.use("/", resource);
app.use("/", statusRoutes); // Added the status routes
app.use("/", progress);

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("Hello world");
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}...`);
});
