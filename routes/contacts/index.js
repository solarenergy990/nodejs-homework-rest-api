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
const wrapError = require('../../helpers/errorHandler');

router.get('/', guard, wrapError(getContacts));

router.get('/:contactId', guard, validateId, wrapError(getContact));

router.post('/', guard, validateContact, wrapError(createContact));

router.delete('/:contactId', guard, validateId, wrapError(removeContact));

router.put(
  '/:contactId',
  guard,
  [(validateId, validateContact)],
  wrapError(updateContact),
);

router.patch(
  '/:contactId/favorite/',
  guard,
  [(validateId, validateContactStatus)],
  wrapError(getFavoriteStatus),
);

module.exports = router;
