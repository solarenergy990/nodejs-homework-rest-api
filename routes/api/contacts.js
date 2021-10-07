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

router.get('/', getContacts);

router.get('/:contactId', validateId, getContact);

router.post('/', validateContact, createContact);

router.delete('/:contactId', validateId, removeContact);

router.put('/:contactId', [validateId, validateContact], updateContact);

router.patch(
  '/:contactId/favorite/',
  [validateId, validateContactStatus],
  getFavoriteStatus,
);

module.exports = router;
