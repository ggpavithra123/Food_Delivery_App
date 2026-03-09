import { v2 as cloudinary } from 'cloudinary';

export const configCloudinary = () => {
  cloudinary.config({
    cloud_name: 'dwaqy7zmb',
    api_key: '896538851812862',
    api_secret: '_jYYO69E6vcRfPvjfpwgpDdSxwc',
  });

  return cloudinary;
};
