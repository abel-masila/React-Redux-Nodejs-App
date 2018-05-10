const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();
const port = process.env.PORT || 3000;
//db config
const db = require("./config/keys").mongoURI;
//connect to mongodb
mongoose
  .connect(db)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.log(`Error : ${err}`);
  });

app.get("/", (req, res) => {
  res.send("Hello");
});

//Use Routes
app.use("/api/users", users);
app.use("/api/profile", posts);
app.use("/api/posts", posts);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
