"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTransaction = exports.getAllUsers = exports.getUserBalance = exports.refreshTokenProcess = exports.deleteRefreshToken = exports.createUser = exports.login = void 0;
var jwtHelpers_1 = require("./../../config/jwtHelpers");
var userModel_1 = __importDefault(require("../models/userModel"));
var cryptr_1 = __importDefault(require("cryptr"));
var jwtHelpers_2 = require("../../config/jwtHelpers");
var validationController_1 = require("./validationController");
var redisController_1 = require("./redisController");
var cryptr = new cryptr_1.default('myTotalySecretKey');
var login = function (req, res, done) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, validationConfirmed, email, password;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userData = req.body;
                return [4, (0, validationController_1.validateLogin)(userData)];
            case 1:
                validationConfirmed = _a.sent();
                if (!validationConfirmed) {
                    return [2, res.status(422).send({ msg: "one or more value is required!" })];
                }
                email = req.body.email.toLowerCase();
                password = req.body.password;
                try {
                    userModel_1.default.findOne({ email: email }, function (error, user) {
                        if (!user) {
                            res.status(404).send({ msg: 'user not found!' });
                        }
                        else {
                            var databasePassword = user.password;
                            var decrypePass = cryptr.decrypt(databasePassword);
                            if (decrypePass === password) {
                                var accessToken = (0, jwtHelpers_2.generateAccessToken)(user);
                                var refreshToken = (0, jwtHelpers_1.generateRefreshToken)(user);
                                res.status(200).send({ "accessToken": accessToken, "refreshToken": refreshToken });
                            }
                            else {
                                res.status(401).send({ msg: ' Invalid User Credentials.' });
                            }
                        }
                    });
                }
                catch (error) {
                    res.status(400).send({ msg: ' Cannot process login.' });
                }
                return [2];
        }
    });
}); };
exports.login = login;
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, validationConfirmed, user, crypePassword;
    return __generator(this, function (_a) {
        userData = req.body;
        try {
            validationConfirmed = (0, validationController_1.validateUserRecord)(userData);
            if (!validationConfirmed) {
                return [2, res.status(422).send({ msg: "one or more value is required!" })];
            }
            user = new userModel_1.default();
            user.email = req.body.email.toLowerCase();
            user.name = req.body.name.toLowerCase();
            crypePassword = cryptr.encrypt(req.body.password);
            user.password = crypePassword;
            user.save(function (err, success) {
                if (err) {
                    if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
                        return res.status(500).send({ msg: "Error - User already exist!!", });
                    }
                    else {
                        return res.status(500).send({ msg: " Registration fail!!", err: err });
                    }
                }
                else {
                    return res.status(200).send({ msg: "Registration successful" });
                }
            });
        }
        catch (error) {
            res.status(500).send({ message: " Something went wrong!" });
        }
        return [2];
    });
}); };
exports.createUser = createUser;
var deleteRefreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenKey = req.params.key;
                if (!tokenKey) return [3, 2];
                return [4, (0, redisController_1.deleteRedisRecord)(tokenKey)];
            case 1:
                _a.sent();
                res.status(200).send({ msg: "Refresh token has been deleted!" });
                return [3, 3];
            case 2:
                res.status(422).send({ msg: "Failed to delete user refresh token!" });
                _a.label = 3;
            case 3: return [2];
        }
    });
}); };
exports.deleteRefreshToken = deleteRefreshToken;
var refreshTokenProcess = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, isTokenValid, tokenDecoded, currentUser, isTokenValid_1, newAccessToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                refreshToken = req.body.token;
                isTokenValid = (0, jwtHelpers_1.verifyTokenIfExpire)(refreshToken);
                if (!isTokenValid) {
                    return [2, res.status(401).send("Expired token!")];
                }
                if (!refreshToken) return [3, 5];
                return [4, (0, jwtHelpers_1.tokenDecoderHelper)(refreshToken)];
            case 1:
                tokenDecoded = _a.sent();
                if (!(tokenDecoded === null || tokenDecoded === void 0 ? void 0 : tokenDecoded.id)) {
                    return [2, res.status(401).send("Invalid token supply!")];
                }
                return [4, userModel_1.default.findOne({ _id: tokenDecoded === null || tokenDecoded === void 0 ? void 0 : tokenDecoded.id })];
            case 2:
                currentUser = _a.sent();
                return [4, (0, jwtHelpers_1.verifyTokenIfExpire)(refreshToken)];
            case 3:
                isTokenValid_1 = _a.sent();
                if (!isTokenValid_1) {
                    return [2, res.status(401).send({ msg: "Refresh token is expired!" })];
                }
                return [4, (0, jwtHelpers_2.generateAccessToken)(currentUser)];
            case 4:
                newAccessToken = _a.sent();
                res.status(200).send({ "accessToken": newAccessToken });
                return [3, 6];
            case 5: return [2, res.status(422).send({ msg: "Please provide a refresh token!" })];
            case 6: return [2];
        }
    });
}); };
exports.refreshTokenProcess = refreshTokenProcess;
var getUserBalance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, userObject, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentUser = req === null || req === void 0 ? void 0 : req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, userModel_1.default.findById({ _id: currentUser._id })];
            case 2:
                userObject = _a.sent();
                res.status(200).send({ balance: userObject.balance });
                return [3, 4];
            case 3:
                error_1 = _a.sent();
                res.status(404).send({ msg: " no user record!" });
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.getUserBalance = getUserBalance;
var getAllUsers = function (req, response) { return __awaiter(void 0, void 0, void 0, function () {
    var allUsersList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, userModel_1.default.find({})];
            case 1:
                allUsersList = _a.sent();
                response.status(200).send(allUsersList);
                return [2];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
var processTransaction = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var beneficiaryEmail, amount, beneficiaryUserObject, currentUserObject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                beneficiaryEmail = req.body.email.toLowerCase();
                amount = parseInt(req.body.amount);
                if (!beneficiaryEmail || !amount) {
                    return [2, res.status(422).send({ msg: "Failed, please provide amount and beneficiary email!" })];
                }
                return [4, userModel_1.default.findOne({ email: beneficiaryEmail })];
            case 1:
                beneficiaryUserObject = _a.sent();
                if (!beneficiaryUserObject) {
                    return [2, res.status(422).send({ msg: " beneficiary email not found!" })];
                }
                return [4, userModel_1.default.findOne({ _id: req._id })];
            case 2:
                currentUserObject = _a.sent();
                if (currentUserObject.balance < amount) {
                    return [2, res.status(422).send({ msg: "Insufficient balance!" })];
                }
                currentUserObject.balance = currentUserObject.balance - amount;
                beneficiaryUserObject.balance = beneficiaryUserObject.balance + amount;
                return [4, currentUserObject.save()];
            case 3:
                _a.sent();
                return [4, beneficiaryUserObject.save()];
            case 4:
                _a.sent();
                res.status(200).send({ msg: "Transaction successful", newBalance: currentUserObject.balance });
                return [2];
        }
    });
}); };
exports.processTransaction = processTransaction;
//# sourceMappingURL=usersController.js.map