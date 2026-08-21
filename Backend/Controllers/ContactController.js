const Contact = require("../Models/ContactSchema");

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      message: "Message sent successfully",
      contact: newContact,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Contacts fetched successfully",
      contacts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};

module.exports = {
  submitContact,
  getContacts,
};
