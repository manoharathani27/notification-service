const Preference = require('../models/Preference');

async function getPreferences(req, res) {
  try {
    let prefs = await Preference.findOne({ where: { userId: req.user.id } });
    if (!prefs) prefs = await Preference.create({ userId: req.user.id });
    res.json({ success: true, preferences: prefs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updatePreferences(req, res) {
  try {
    const { emailEnabled, smsEnabled, inappEnabled } = req.body;
    let prefs = await Preference.findOne({ where: { userId: req.user.id } });
    if (!prefs) prefs = await Preference.create({ userId: req.user.id });
    await prefs.update({ emailEnabled, smsEnabled, inappEnabled });
    res.json({ success: true, preferences: prefs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getPreferences, updatePreferences };
