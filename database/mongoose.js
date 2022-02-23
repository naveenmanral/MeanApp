const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true})
    .then(() => console.log("Database connected"))
    .catch((error) => console.log(error));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose Connection Disconnected.');
});

process.on('SIGINT', async() => {
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = mongoose;