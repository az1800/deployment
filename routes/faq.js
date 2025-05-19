const express = require('express');
const router = express.Router();
const FAQ = require('../models/faq');

// GET all FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new FAQ
router.post('/', async (req, res) => {
    const faq = new FAQ({
        title: req.body.title,
        titleArabic: req.body.titleArabic,
        subtitle: req.body.subtitle,
        subtitleArabic: req.body.subtitleArabic
    });

    try {
        const newFAQ = await faq.save();
        res.status(201).json(newFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;