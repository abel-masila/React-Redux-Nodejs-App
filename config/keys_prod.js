const mongoURI = process.env.MONGO_URI;
//const mongoURI = "mongodb://localhost:27017/dev_connect";
const secretOrKey = process.env.SECRET_OR_KEY;
module.exports = { mongoURI, secretOrKey };
