const express = require("express");
const app = express();

const mongoose = require("mongoose");

const UserModel = require("./models/User");
const User = mongoose.model("User", UserModel);

const mongoUrl = "mongodb://localhost:27017/guiapics";
const mongoConfigs = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(mongoUrl, mongoConfigs)
  .then(() => {})
  .catch((err) => {
    console.log("Conexão Mongo - Erro: " + err);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({});
});

app.post("/user", async (req, res) => {
  if (req.body.name == "" || req.body.email == "" || req.body.password == "") {
    res.status(400);
    res.send({ err: "Credenciais em branco" });
    return;
  }

  try {
    let user = await User.findOne({email: req.body.email });

    if (user != undefined) {
      res.status(400);
      res.json({ err: "E-mail já cadastrado" });
      return;
    }

    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await newUser.save();

    res.json({ email: newUser.email });
  } catch (err) {
    res.status(500);
    res.send({ err: err });
  }
});

module.exports = app;
