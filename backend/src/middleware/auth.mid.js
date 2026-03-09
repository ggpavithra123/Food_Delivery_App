//import { verify } from 'jsonwebtoken';
//const { verify } = require('jsonwebtoken');
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import { UNAUTHORIZED } from '../constants/httpStatus.js';

export default (req, res, next) => {
   //const token = localStorage.getItem("token");
  const token = req.headers.access_token;
  console.log("token:",token);
  if (!token) 
  
  return res.status(UNAUTHORIZED).send();

  try {
    const decoded = verify(token, 'SomeRandomText');
    req.user = decoded;
  
  } catch (error) {
    res.status(UNAUTHORIZED).send();
  }

  return next();
};
