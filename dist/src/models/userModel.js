"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    balance: { type: Number, default: 5000 },
    password: { type: String, required: true, minlength: [6, 'password must be at least 6 character'] },
    role: { type: String, default: 'USER', enum: ['ADMIN', 'USER'] }
}, {
    timestamps: true
});
var usersModel = (0, mongoose_1.model)('users', userSchema);
exports.default = usersModel;
//# sourceMappingURL=userModel.js.map