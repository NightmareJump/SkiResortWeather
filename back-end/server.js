// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

// 1. 引入 Mongoose 模型（假设位于 models/SkiResort.js）
const SkiResort = require('./models/SkiResort');

// 2. 引入路由文件（假设位于 routes/skiResort.js）
const skiResortRoutes = require('./routes/skiResort');

// 初始化 Express 应用
const app = express();
app.use(cors());
app.use(express.json());

// 连接 MongoDB Atlas
// 注意替换下面的 URI 为你的实际连接字符串
mongoose.connect(
  'mongodb+srv://y62meng:Yanyuemeng1995@cluster0.0frss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(async () => {
  console.log('Connected to MongoDB');

  // 1) 插入初始数据（若数据库中无任何 SkiResort 记录）
  await seedInitialData();

  // 2) 设置定时任务：每分钟随机更新雪场数据
  cron.schedule('* * * * *', async () => {
    console.log('每分钟随机更新所有雪场的降雪和温度...');
    await updateRandomWeatherForAll();
  });

  // 3) 挂载路由：/api/skiResorts
  app.use('/api/skiResorts', skiResortRoutes);

  // 4) 示例根路由
  app.get('/', (req, res) => {
    res.send('Hello from Express - Ski Resort Weather');
  });

  // 启动服务器
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

//====================================================
// 函数: seedInitialData
// - 如果数据库里没有任何 SkiResort 文档，就插入一些默认数据
//====================================================
async function seedInitialData() {
  try {
    const count = await SkiResort.countDocuments();
    if (count === 0) {
      console.log('No ski resorts found, inserting initial data...');
      const defaultResorts = [
        {
          name: 'Whistler Blackcomb',
          location: 'Whistler, BC, Canada',
          snowfall: 100,
          temperature: -5,
          updatedAt: new Date(),
        },
        {
          name: 'Lake Louise Ski Resort',
          location: 'Lake Louise, AB, Canada',
          snowfall: 80,
          temperature: -10,
          updatedAt: new Date(),
        },
        {
          name: 'Sunshine Village',
          location: 'Banff, AB, Canada',
          snowfall: 90,
          temperature: -8,
          updatedAt: new Date(),
        },
      ];

      await SkiResort.insertMany(defaultResorts);
      console.log('Default ski resort data inserted!');
    } else {
      console.log(`Database already has ${count} ski resort documents. Skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}

//====================================================
// 函数: updateRandomWeatherForAll
// - 每分钟执行一次，为所有 SkiResort 随机更新降雪量和温度
//====================================================
async function updateRandomWeatherForAll() {
  try {
    // 查询所有 SkiResort
    const resorts = await SkiResort.find({});

    for (let resort of resorts) {
      // 生成随机降雪量 [0, 100)
      const randomSnowfall = Math.floor(Math.random() * 100);
      // 生成随机温度 [-10, 15)
      const randomTemperature = Math.floor(Math.random() * 25) - 10;

      // 更新 resort
      resort.snowfall = randomSnowfall;
      resort.temperature = randomTemperature;
      resort.updatedAt = new Date();
      await resort.save();

      console.log(
        `更新: ${resort.name} => Snowfall: ${randomSnowfall}, Temp: ${randomTemperature}`
      );
    }
  } catch (err) {
    console.error('Error updating random weather data:', err);
  }
}
