import { check } from 'express-validator';

export const movieValidation = [
  check('title', 'Title is required').notEmpty(),
  check('releaseDate', 'Release date must be a valid date').isDate(),
  check('filmDirector', 'Film director must be an array of strings').isArray(),
  check('trailerLink', 'Trailer link must be a valid URL').isURL(),
  check('posterUrl', 'Poster URL must be a valid URL').isURL(),
  check('genres', 'Genres must be an array of strings').optional().isArray(),
];


// export const genreValidation = [
//   check('genres', 'Genres must be an array of strings').optional().isArray(),
// ];

// export const yearValidation = [
//   check('releaseDate', 'Release date must be a valid date').isDate(),
// ];

// export const filmDirectorValidation = [
//   check('filmDirector', 'Film director must be an array of strings').isArray(),
// ];

export const userValidation = [
  check('username').notEmpty().withMessage('Username is required'),
check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
];

// Custom password validation regex

// At least 8 characters long
// Contains at least one uppercase letter
// Contains at least one lowercase letter
// Contains at least one digit
// Contains at least one special character (e.g., !@#$%^&*)
