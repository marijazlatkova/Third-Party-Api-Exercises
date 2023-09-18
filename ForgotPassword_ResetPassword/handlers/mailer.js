const Mailer = require("../pkg/mailer");
const { MailgunFields, validate } = require("../pkg/mailer/validate");

const sendMessage = async (req, res) => {
  try {
    await Mailer.sendMessage();
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

const sendWelcomeMail = async (req, res) => {
  try {
    await validate(req.body, MailgunFields);
    const result = await Mailer.sendMail(
      req.body.to,
      "WELCOME",
      req.body.message
    );
    return res.status(201).send(result);
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

const sendPasswordResetMail = async (req, res) => {
  try {
    const result = await Mailer.sendMail(
      req.body.to,
      "PASSWORD_RESET",
      req.body.message
    );
    return res.status(201).send(result);
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  sendMessage,
  sendWelcomeMail,
  sendPasswordResetMail
};