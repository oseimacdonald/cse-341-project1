const express = require('express');
const router = express.Router();
const contactsRouter = require('./contacts');

router.use('/contacts', contactsRouter);

router.get('/', (req, res) => {
    res.send('Contacts API - Week 01');
});

module.exports = router;