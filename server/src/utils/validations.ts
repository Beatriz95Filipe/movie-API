// import { check } from 'express-validator';

// export const deviceValidation = [
//   check('name', 'Name is required').notEmpty(),
//   check('description', 'Description must be a string').optional().isString(),
//   check('price', 'Price must be a valid number').isNumeric(),
//   check('brandId', 'Brand ID is required').notEmpty(),
//   check('typeId', 'Type ID is required').notEmpty(),
// ];

// export const typeValidation = [
//   check('name', 'Type name is required').notEmpty(),
// ];

// export const brandValidation = [
//   check('name', 'Brand name is required').notEmpty(),
// ];

/*

check('username').notEmpty().withMessage('Username is required'),
 check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
check('price').isNumeric().withMessage('Price must be a numeric value')
// Custom password validation regex

At least 8 characters long
Contains at least one uppercase letter
Contains at least one lowercase letter
Contains at least one digit
Contains at least one special character (e.g., !@#$%^&*)


*/