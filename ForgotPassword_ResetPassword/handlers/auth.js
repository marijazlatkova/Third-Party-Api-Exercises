const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../pkg/config");
const Account = require("../pkg/accounts");
const { AccountRegister, AccountLogin, validate } = require("../pkg/accounts/validate");
const { sendMail } = require("../pkg/mailer");

const register = async (req, res) => {
  try {
    await validate(req.body, AccountRegister);
    const exists = await Account.getByEmail(req.body.email);
    if (exists) {
      throw {
        code: 400,
        error: "Account exists!"
      };
    }
    req.body.password = bcrypt.hashSync(req.body.password);
    const account = await Account.create(req.body);
    return res.status(201).send(account);
  } catch (err) {
    return res.status(err.code).send(err.error);
  }
};

const login = async (req, res) => {
  try {
    await validate(req.body, AccountLogin);
    const account = await Account.getByEmail(req.body.email);
    if (!account) {
      throw {
        code: 400,
        error: "Acount not found!"
      };
    }
    if (!bcrypt.compareSync(req.body.password, account.password)) {
      throw {
        code: 400,
        error: "Wrong password!"
      };
    }
    const payload = {
      full_name: account.full_name,
      email: account.email,
      id: account._id,
      exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60
    };
    const token = jwt.sign(payload, config.getSection("development").jwt_key);
    return res.status(200).send({ token });
  } catch (err) {
    return res.status(err.code).send(err.error);
  }
};

const refreshToken = async (req, res) => {
  const payload = {
    ...req.auth,
    exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60
  };
  const token = jwt.sign(payload, config.getSection("development").jwt_key);
  return res.send({ token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await Account.getByEmail(email);
  if (!user) {
    res.status(400).send("User not registered");
  }
  const secret = config.getSection("development").jwt_key + user.password;
  const payload = {
    email: user.email,
    id: user.id
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const link = `http://localhost:10000/reset-password/${user.id}/${token}`;
  try {
    await sendMail(user.email, "PASSWORD_RESET", { user, link });
    res.status(200).send("Password reset link has been sent to your email");
  } catch (err) {
    return res.status(500).send("Message not sent!");
  }
};

const resetPassTemplate = async (req, res) => {
  const { id, token } = req.params;
  const user = await Account.getById(id);
  if (id !== user.id) {
    return res.status(400).send("Invalid id");
  }
  const secret = config.getSection("development").jwt_key + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.render("reset-password", { email: user.email });
  } catch (err) {
    res.send(err.message);
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPass } = req.body;
  if (password !== confirmPass) {
    return res.status(400).send("Passwords do not match!");
  }
  const user = await Account.getById(id);
  if (id !== user.id) {
    return res.status(400).send("Invalid id");
  }
  const secret = config.getSection("development").jwt_key + user.password;
  try {
    const payload = jwt.verify(token, secret);
    await Account.setNewPassword(user.id, password);
    user.password = password;
    res.send(user);
    res.render("reset-password", { email: user.email });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  resetPassTemplate
};