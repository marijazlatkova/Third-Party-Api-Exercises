const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String
});

const Account = mongoose.model("accounts", accountSchema);

const create = async (acc) => {
  const account = new Account(acc);
  return await account.save();
};

const getAll = async () => {
  return await Account.find({});
};

const getById = async (id) => {
  return await Account.findOne({ _id: id });
};

const getByEmail = async (email) => {
  return await Account.findOne({ email });
};

const setNewPassword = async (id, password) => {
  return await Account.updateOne({ _id: id }, password);
};

const update = async (id, acc) => {
  return await Account.updateOne({ _id: id }, acc);
};

const remove = async (id) => {
  return await Account.deleteOne({ _id: id });
};

module.exports = {
  create,
  getAll,
  getById,
  getByEmail,
  setNewPassword,
  update,
  remove
};