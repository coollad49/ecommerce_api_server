"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const http_errors_1 = __importDefault(require("http-errors"));
const AuthRoute_1 = require("@/routes/AuthRoute");
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.get('/', async (req, res, next) => {
    res.send("Jesus is glorified!!!");
});
app.use('/auth', AuthRoute_1.authRouter);
app.use(async (req, res, next) => {
    next(http_errors_1.default.NotFound());
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
