"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateUserRecord = void 0;
var validateUserRecord = function (userData) {
    if (!(userData === null || userData === void 0 ? void 0 : userData.email) || !userData.password || !(userData === null || userData === void 0 ? void 0 : userData.name)) {
        return false;
    }
    return true;
};
exports.validateUserRecord = validateUserRecord;
var validateLogin = function (userData) {
    if (!(userData === null || userData === void 0 ? void 0 : userData.email) || !userData.password) {
        return false;
    }
    return true;
};
exports.validateLogin = validateLogin;
//# sourceMappingURL=validationController.js.map