//import { sample_foods, sample_tags } from "../../../backend/src/data";
import axios from 'axios';
//export const getAll = async () => sample_foods;

//import axios from 'axios';

export const getAll = async () => {
  const { data } = await axios.get('https://food-delivery-app-lnv6.onrender.com/api/foods');
  return data;
};

export const search = async searchTerm => {
  const { data } = await axios.get('https://food-delivery-app-lnv6.onrender.com/api/foods/search/' + searchTerm);
  return data;
};

export const getAllTags = async () => {
  const { data } = await axios.get('https://food-delivery-app-lnv6.onrender.com/api/foods/tags');
  return data;
};

export const getAllByTag = async tag => {
  if (tag === 'All') return getAll();
  const { data } = await axios.get('https://food-delivery-app-lnv6.onrender.com/api/foods/tags/' + tag);
  return data;
};

export const getById = async foodId => {
  const { data } = await axios.get('https://food-delivery-app-lnv6.onrender.com/api/foods/' + foodId);
  return data;
};


export async function deleteById(foodId) {
  await axios.delete('https://food-delivery-app-lnv6.onrender.com/api/foods/' + foodId);
}

export async function update(food) {
  await axios.put('https://food-delivery-app-lnv6.onrender.com/api/foods', food);
}

export async function add(food) {
  const { data } = await axios.post('https://food-delivery-app-lnv6.onrender.com/api/foods', food);
  return data;
}

// export const search = async (searchTerm) => {
//   const searchFoods = sample_foods.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   console.log("search:", searchFoods);

//   // Save to localStorage for caching
//   localStorage.setItem("searchFoods", JSON.stringify(searchFoods));

//   // ✅ Return result so that HomePage can use it
//   return searchFoods;
// };

// export const getAllTags = async () => sample_tags;

// export const getAllByTag = async (tag) => {
//   if (tag === "All") return getAll();
//   return sample_foods.filter((item) => item.tags?.includes(tag));
// };

// export const getById = async (foodId) => {
//   const food = sample_foods.find((item) => item.id === foodId);
//   return food; // ✅ return the found item
// };
