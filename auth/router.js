const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const User = require("../user/model");
const bcrypt = require("bcrypt");
const auth = require("./middleware");

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const loginInfo = req.body;
    if (!loginInfo.email || !loginInfo.password) {
      res.status(400).send({
        message: "Please supply a valid email and password"
      });
    } else {
      const userFound = await User.findOne({
        where: {
          email: loginInfo.email
        }
      });
      if (!userFound) {
        res.status(400).send({
          message: "User with that email does not exist"
        });
      } else if (bcrypt.compareSync(loginInfo.password, userFound.password)) {
        res.send({
          jwt: toJWT({ userId: userFound.id })
          // id: userFound.id
        });
      } else {
        res.status(400).send({
          message: "Password was incorrect"
        });
      }
    }
  } catch (error) {
    console.error(err);
    res.status(500).send({
      message: "Something went wrong"
    });
  }
});

router.get("/secret-endpoint", auth, (req, res) => {
  console.log('req.user test:', req.user)
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.email}.`
  });
});

module.exports = router;
