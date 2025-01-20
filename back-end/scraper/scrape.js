const axios = require('axios');
const cheerio = require('cheerio');
const SkiResort = require('../models/SkiResort');

const scrapeSkiResortData = async () => {
  try {
    const resortsConfig = [
      {
        name: 'Whistler Blackcomb',
        url: 'https://www.whistlerblackcomb.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx',
      },
      // ... 其他雪场
    ];

    for (let config of resortsConfig) {
      // 即使仍然请求页面，这里我们先不解析也行
      const { data } = await axios.get(config.url);
      const $ = cheerio.load(data);

      // 原先可能有解析逻辑，这里注释掉或保留都行
      // const snowfall = $('#some-id-for-snowfall').text(); 
      // const temperature = $('#some-id-for-temp').text();

      let resort = await SkiResort.findOne({ name: config.name });
      if (!resort) {
        resort = new SkiResort({ name: config.name });
      }

      // 将 snowfall 和 temperature 写死为固定值
      resort.snowfall = 100;    // 例如固定为 100
      resort.temperature = -5;  // 例如固定为 -5

      resort.updatedAt = new Date();
      await resort.save();

      console.log(`${config.name} 数据更新完成（已写入固定值）`);
    }
  } catch (err) {
    console.error('爬虫出错', err);
  }
};

module.exports = { scrapeSkiResortData };
