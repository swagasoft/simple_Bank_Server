"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwtHelpers_1 = require("./../../config/jwtHelpers");
var express_1 = __importDefault(require("express"));
var config_1 = __importDefault(require("config"));
var usersController_1 = require("../controllers/usersController");
var userRouterController = express_1.default.Router();
var API_VERSION = config_1.default.get('API_VERSION');
userRouterController.post("/".concat(API_VERSION, "/login"), usersController_1.login);
userRouterController.post("/".concat(API_VERSION, "/create-user"), usersController_1.createUser);
userRouterController.post("/".concat(API_VERSION, "/refresh-token"), usersController_1.refreshTokenProcess);
userRouterController.delete("/".concat(API_VERSION, "/delete-token:key"), usersController_1.deleteRefreshToken);
userRouterController.get("/".concat(API_VERSION, "/get-user-balance"), jwtHelpers_1.verifyJwtToken, usersController_1.getUserBalance);
userRouterController.put("/".concat(API_VERSION, "/perform-transaction"), jwtHelpers_1.verifyJwtToken, usersController_1.processTransaction);
userRouterController.get("/".concat(API_VERSION, "/get-all-users"), jwtHelpers_1.verifyJwtToken, jwtHelpers_1.verifyAdminRole, usersController_1.getAllUsers);
userRouterController.delete("/".concat(API_VERSION, "/revoke-user-access:key"), jwtHelpers_1.verifyJwtToken, jwtHelpers_1.verifyAdminRole, usersController_1.deleteRefreshToken);
exports.default = userRouterController;
//# sourceMappingURL=userRouterController.js.map