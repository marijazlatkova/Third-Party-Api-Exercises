const express = require("express");
const { expressjwt: jwt } = require("express-jwt");

const config = require("./pkg/config");
require("./pkg/db");

const { sendMessage, sendWelcomeMail, sendPasswordResetMail } = require("./handlers/mailer");
const { login, register, refreshToken, forgotPassword, resetPassword, resetPassTemplate } = require("./handlers/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  "/api",
  jwt({
    secret: config.getSection("development").jwt_key,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/v1/auth/login",
      "/api/v1/auth/register",
      "/api/v1/auth/forgot-password",
      "/api/v1/auth/refresh-token"
    ],
  })
);

app.post("/api/v1/auth/login", login);
app.post("/api/v1/auth/register", register);
app.get("/api/v1/auth/refresh-token", refreshToken);
app.post("/api/v1/auth/forgot-password", forgotPassword);
app.post("/reset-password/:id/:token", resetPassword);
app.get("/reset-password/:id/:token", resetPassTemplate);
app.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

app.post("/api/v1/sendmessage", sendMessage);
app.post("/api/v1/sendmail", sendWelcomeMail);
app.post("/api/v1/reset-pass", sendPasswordResetMail);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedAccess!") {
    res.status(401).send("Invalid token!");
  }
  res.status(err.status).send(err.inner.message);
});

app.listen(config.getSection("development").PORT, (err) => {
  err
    ? console.log(err)
    : console.log(`Server started successfully on port ${config.getSection("development").PORT}`);
});