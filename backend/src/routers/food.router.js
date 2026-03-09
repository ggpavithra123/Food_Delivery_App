import { Router } from "express";
import {sample_foods, sample_tags } from "../data.js";
import { FoodModel } from "../models/food.model.js";
import handler from 'express-async-handler';
import admin from '../middleware/admin.mid.js';

const router = Router();

router.get('/', handler(async (req,res)=>{
    const foods = await FoodModel.find({})
    res.send(foods);
}))

router.post(
  '/',
  admin,
  handler(async (req, res) => {
    const { name, price, tags, favorite, imageUrl, origins, cookTime } =
      req.body;

    const food = new FoodModel({
      name,
      price,
      tags: tags.split ? tags.split(',') : tags,
      favorite,
      imageUrl,
      origins: origins.split ? origins.split(',') : origins,
      cookTime,
    });

    await food.save();

    res.send(food);
  })
);

router.put(
  '/',
  admin,
  handler(async (req, res) => {
    const { id, name, price, tags, favorite, imageUrl, origins, cookTime } =
      req.body;

    await FoodModel.updateOne(
      { _id: id },
      {
        name,
        price,
        tags: tags.split ? tags.split(',') : tags,
        favorite,
        imageUrl,
        origins: origins.split ? origins.split(',') : origins,
        cookTime,
      }
    );

    res.send();
  })
);

router.delete(
  '/:foodId',
  admin,
  handler(async (req, res) => {
    const { foodId } = req.params;
    await FoodModel.deleteOne({ _id: foodId });
    res.send();
  })
);

// router.get('/tags',handler(async (req,res)=>{
//     res.send(sample_tags);
// }))
router.get(
  '/tags',
  handler(async (req, res) => {
    try {
      console.log("📡 [GET] /api/foods/tags called");

      // Step 1: Check database connection
      const foodCount = await FoodModel.countDocuments();
      console.log(`📊 Total Food documents found: ${foodCount}`);

      // Step 2: Run aggregation pipeline
      console.log("🧩 Starting aggregation pipeline...");
      const tags = await FoodModel.aggregate([
        { $unwind: '$tags' },
        {
          $group: {
            _id: '$tags',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            count: '$count',
          },
        },
      ]).sort({ count: -1 });

      console.log("✅ Aggregation completed. Found tags:", tags);

      // Step 3: Add the 'All' tag manually
      const all = {
        name: 'All',
        count: foodCount,
      };

      tags.unshift(all);
      console.log("🧾 Final tags array with 'All' added:", tags);

      // Step 4: Send response
      res.send(tags);
      console.log("🚀 Response sent successfully.");
    } catch (error) {
      console.error("💥 Error in /api/foods/tags route:", error.message);
      console.error(error.stack);
      res.status(500).send({
        message: 'Internal Server Error in /tags',
        error: error.message,
      });
    }
  })
);


// router.get(
//   '/search/:searchTerm',
//   handler(async (req, res) => {
//     const { searchTerm } = req.params;
//     console.log("searchTerm",searchTerm);
//     const searchRegex = new RegExp(searchTerm, 'i');

//     const foods = await FoodModel.find({ name: { $regex: searchRegex } });
//     res.send(foods);
//   })
// );

router.get('/search/:searchTerm', handler(async (req,res)=>{
    const { searchTerm } = req.params;
    const foods = sample_foods.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  res.send(foods);
}))

// router.get('/tags/:tag',(req,res)=>{
//     const { tag } = req.params;
//     const tags = sample_foods.filter((item) => item.tags?.includes(tag));
//     console.log('tags:',tags);
//     res.send(tags);
// })
// router.get("/tags/:tag", handler(async (req, res) => {
//   const { tag } = req.params;
//   let filteredFoods;

//   if (tag.toLowerCase() === "all") {
//     filteredFoods = sample_foods;
//   } else {
//     filteredFoods = sample_foods.filter((item) =>
//       item.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
//     );
//   }

//   console.log("Filtered foods:", filteredFoods);
//   res.send(filteredFoods);
// }));

router.get(
  '/tags/:tag',
  handler(async (req, res) => {
    const { tag } = req.params;
    const foods = await FoodModel.find({ tags: tag });
    res.send(foods);
  })
);

router.get(
  '/:foodId',
  handler(async (req, res) => {
    const { foodId } = req.params;
    const food = await FoodModel.findById(foodId);
    res.send(food);
  })
);

// router.get('/:foodId',handler(async (req,res)=>{
//     const { foodId } = req.params;
//     const food = sample_foods.find(item => item.id === foodId);
//     res.send(food);
// }))

export default router;