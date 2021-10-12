const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContact,
  createContact,
  removeContact,
  updateContact,
  getFavoriteStatus,
} = require('../../controllers/contacts');
const {
  validateContact,
  validateContactStatus,
  validateId,
} = require('./validation');

const guard = require('../../helpers/guard');

router.get('/', guard, getContacts);

router.get('/:contactId', guard, validateId, getContact);

router.post('/', guard, validateContact, createContact);

router.delete('/:contactId', guard, validateId, removeContact);

router.put(
  '/:contactId',
  guard,
  [(validateId, validateContact)],
  updateContact,
);

router.patch(
  '/:contactId/favorite/',
  guard,
  [(validateId, validateContactStatus)],
  getFavoriteStatus,
);

module.exports = router;
