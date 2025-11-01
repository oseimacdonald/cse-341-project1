const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

// GET all contacts
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const contacts = await db.collection('contacts').find().toArray();
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// GET single contact by ID
router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        
        // Validate if the ID is a valid ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid contact ID format' });
        }

        const contact = await db.collection('contacts').findOne({ 
            _id: new ObjectId(req.params.id) 
        });

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: 'Failed to fetch contact' });
    }
});

module.exports = router;