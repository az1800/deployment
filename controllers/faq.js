const FAQ = require('../models/faq');

exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const { title, titleArabic, subtitle, subtitleArabic } = req.body;
    const faq = new FAQ({
      title,
      titleArabic,
      subtitle,
      subtitleArabic
    });
    await faq.save();
    res.status(201).json({ message: 'FAQ created successfully', faq });
  } catch (err) {
    res.status(500).json({ message: 'Error creating FAQ' });
  }
};