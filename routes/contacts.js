const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the contact
 *         firstName:
 *           type: string
 *           description: First name of the contact
 *         lastName:
 *           type: string
 *           description: Last name of the contact
 *         email:
 *           type: string
 *           description: Email address of the contact
 *         favoriteColor:
 *           type: string
 *           description: Favorite color of the contact
 *         birthday:
 *           type: string
 *           format: date
 *           description: Birthday of the contact
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the contact was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the contact was last updated
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john.doe@example.com"
 *         favoriteColor: "Blue"
 *         birthday: "1990-01-01"
 *         createdAt: "2024-01-01T00:00:00.000Z"
 *         updatedAt: "2024-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of all contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Contact details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        
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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    try {
        const db = getDb();
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ error: 'All fields (firstName, lastName, email, favoriteColor, birthday) are required' });
        }

        const newContact = {
            firstName,
            lastName,
            email,
            favoriteColor,
            birthday,
            createdAt: new Date()
        };

        const result = await db.collection('contacts').insertOne(newContact);
        
        res.status(201).json({ 
            message: 'Contact created successfully',
            id: result.insertedId 
        });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 modifiedCount:
 *                   type: number
 *       400:
 *         description: Invalid ID format or no fields provided
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
    try {
        const db = getDb();
        
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid contact ID format' });
        }

        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        if (!firstName && !lastName && !email && !favoriteColor && !birthday) {
            return res.status(400).json({ error: 'At least one field must be provided for update' });
        }

        const updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (email) updateFields.email = email;
        if (favoriteColor) updateFields.favoriteColor = favoriteColor;
        if (birthday) updateFields.birthday = birthday;
        updateFields.updatedAt = new Date();

        const result = await db.collection('contacts').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ 
            message: 'Contact updated successfully',
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: number
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    try {
        const db = getDb();
        
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid contact ID format' });
        }

        const result = await db.collection('contacts').deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ 
            message: 'Contact deleted successfully',
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

module.exports = router;