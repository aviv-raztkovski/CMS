const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

exports.connect = () => {
    mongoose
        .connect(MONGO_URI)
        .then(() => {
            console.log('Connencted to DB successfully');
        })
        .catch((err) => {
            console.log("DB connection failed. Exiting...");
            console.error(err);
            process.exit(1);
        })
}