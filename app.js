const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ilkhamburkhonov:yfANUzN7sMadCnYE@cluster0.lm9j4.mongodb.net/Cluster0?retryWrites=true&w=majority";

async function dropIndex() {
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = mongoose.connection.db;
    await db.collection('progresses').dropIndex("subStages.subStageId_1");
    console.log("Index dropped successfully");

    mongoose.connection.close();
}

dropIndex().catch(console.error);
