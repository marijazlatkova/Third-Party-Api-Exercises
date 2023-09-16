const express = require("express");

const config = require("./pkg/config");
const { sendWelcomeMail } = require("./handlers/mailer");

const app = express();
app.use(express.json());

app.post("/api/v1/send-email", sendWelcomeMail);

app.listen(config.getSection("development").port, (err) => {
  err
    ? console.log(err)
    : console.log(`Server started successfully on port ${config.getSection("development").port}`);
});