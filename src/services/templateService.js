const Handlebars = require('handlebars');
const Template = require('../models/Template');

async function renderTemplate(templateId, variables = {}) {
  const template = await Template.findByPk(templateId);
  if (!template) throw new Error(`Template ${templateId} not found`);

  const compiledBody = Handlebars.compile(template.body)(variables);
  const compiledSubject = template.subject
    ? Handlebars.compile(template.subject)(variables)
    : null;

  return { subject: compiledSubject, content: compiledBody, channel: template.channel };
}

async function createTemplate({ name, channel, subject, body, variables }) {
  return Template.create({ name, channel, subject, body, variables });
}

async function getAllTemplates() {
  return Template.findAll({ order: [['createdAt', 'DESC']] });
}

async function getTemplateById(id) {
  const t = await Template.findByPk(id);
  if (!t) throw new Error('Template not found');
  return t;
}

async function updateTemplate(id, data) {
  const t = await Template.findByPk(id);
  if (!t) throw new Error('Template not found');
  return t.update(data);
}

async function deleteTemplate(id) {
  const t = await Template.findByPk(id);
  if (!t) throw new Error('Template not found');
  await t.destroy();
}

module.exports = { renderTemplate, createTemplate, getAllTemplates, getTemplateById, updateTemplate, deleteTemplate };
