import express from 'express';

// import { register, login, logout, getOtherUsers } from '../controllers/userController.js';
import * as userController from '../controllers/userController.js';
import * as urlController from '../controllers/urlController.js';

import { isAuthenticated, isUser, isAdmin, isClerk } from '../middleware/isAuthenticated.js';


console.log("Route.js loaded");

const router = express.Router();

// user routes
router.route('/user/register').post(userController.register); //working
router.route('/user/login').post(userController.login); //working
router.route('/user/logout').get(userController.logout); //working
router.route('/user/getOtherUsers').get(isAuthenticated, isAdmin, userController.getOtherUsers); //working

// url routes
router.route('/url/createUrl').post(isAuthenticated, isClerk, urlController.createUrl); // working
router.route('/url/getZones').get(isAuthenticated, isClerk, urlController.getZones); // working
router.route('/url/addZone').post(isAuthenticated, isClerk, urlController.addZone); // working
router.route('/url/getUrlsFromZone').get(isAuthenticated, isClerk, urlController.getUrlsFromZone); // working

export default router;