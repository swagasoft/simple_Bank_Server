"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var database_1 = __importDefault(require("../config/database"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var userRouterController_1 = __importDefault(require("./routers/userRouterController"));
require("../src/controllers/redisController");
var bodyParser = require("body-parser");
var apiRequestLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    handler: function (req, res) {
        return res.status(429).json({
            error: 'You sent too many requests. Please wait a while then try again'
        });
    }
});
var corsOptions = {
    origin: "*",
};
var app = (0, express_1.default)();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((0, morgan_1.default)("tiny"));
app.use(apiRequestLimiter);
app.use((0, cors_1.default)(corsOptions));
app.use('/api', userRouterController_1.default);
(0, database_1.default)();
var port = process.env.PORT || 5000;
app.get('/', function (req, res) {
    res.send(' Talent Server up and running...!');
});
app.listen(port, function () {
    return console.log("Talent Server is listening at POST ---> :".concat(port));
});
//# sourceMappingURL=app.js.map