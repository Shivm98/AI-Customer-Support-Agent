const express = require('express');
const router = express.Router();
const Query = require('../models/query');
const { sequelize } = require('../models');

router.get('/', async (req, res) => {
  const total = await Query.count();
  const angry = await Query.count({ where: { sentiment: 'angry' } });
  const happy = await Query.count({ where: { sentiment: 'happy' } });
  const top = await Query.findAll({
    attributes: ['question', [sequelize.fn('COUNT', sequelize.col('question')), 'count']],
    group: ['question'],
    order: [[sequelize.literal('count'), 'DESC']],
    limit: 3,
  });
  res.json({ total, angry, happy, top });
});

module.exports = router;
