const express = require('express');
const router = express.Router();
const SkiResort = require('../models/SkiResort.js');

// 获取所有滑雪场信息
router.get('/', async (req, res) => {
  try {
    const resorts = await SkiResort.find({});
    res.json(resorts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 根据 ID 获取单个滑雪场
router.get('/:id', async (req, res) => {
  try {
    const resort = await SkiResort.findById(req.params.id);
    res.json(resort);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 新建/更新滑雪场数据
router.post('/', async (req, res) => {
  try {
    const { name, location, snowfall, temperature } = req.body;
    const newResort = new SkiResort({
      name,
      location,
      snowfall,
      temperature,
      updatedAt: new Date()
    });
    await newResort.save();
    res.json(newResort);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
