const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { create, getAll, getById, update, remove } = require('../controllers/templateController');

router.post('/', auth, create);
router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
