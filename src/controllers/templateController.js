const templateService = require('../services/templateService');

async function create(req, res) {
  try {
    const template = await templateService.createTemplate(req.body);
    res.status(201).json({ success: true, template });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getAll(req, res) {
  try {
    const templates = await templateService.getAllTemplates();
    res.json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getById(req, res) {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    res.json({ success: true, template });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const template = await templateService.updateTemplate(req.params.id, req.body);
    res.json({ success: true, template });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    await templateService.deleteTemplate(req.params.id);
    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
}

module.exports = { create, getAll, getById, update, remove };
