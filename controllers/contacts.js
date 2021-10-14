const Contacts = require('../repository/contacts');
const { HttpCode } = require('../config/constants');
const { CustomError } = require('../helpers/customError');

const getContacts = async (req, res) => {
  const userId = req.user._id;
  const data = await Contacts.listContacts(userId, req.query);

  res.json({ status: 'success', code: HttpCode.OK, data: { ...data } });
};

const getContact = async (req, res) => {
  const userId = req.user._id;
  const contact = await Contacts.getContactById(req.params.contactId, userId);
  if (contact) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  }
  throw new CustomError(404, 'Not Found');
};

const createContact = async (req, res) => {
  const userId = req.user._id;
  const contact = await Contacts.addContact({ ...req.body, owner: userId });
  res
    .status(HttpCode.CREATED)
    .json({ status: 'success', code: HttpCode.CREATED, data: { contact } });
};

const removeContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await Contacts.removeContact(req.params.contactId, userId);
  if (contact) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  }
  throw new CustomError(404, 'Not Found');
};

const updateContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await Contacts.updateContact(
    req.params.contactId,
    req.body,
    userId,
  );
  // console.log('1', req.body);
  if (contact) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  }
  throw new CustomError(404, 'Not Found');
};

const getFavoriteStatus = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await Contacts.updateContact(
    req.params.contactId,
    req.body,
    userId,
  );

  if (contact) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  }
  throw new CustomError(404, 'Not Found');
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  removeContact,
  updateContact,
  getFavoriteStatus,
};
