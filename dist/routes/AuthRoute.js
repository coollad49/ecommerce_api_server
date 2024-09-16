"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const db_1 = __importDefault(require("@/lib/db"));
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw http_errors_1.default.BadRequest();
        const userExists = await db_1.default.user.findUnique({
            where: {
                email: email
            }
        });
        if (userExists)
            throw http_errors_1.default.Conflict(`${email} is already registered.`);
        const user = await db_1.default.user.create({
            data: {
                email: email,
                hashedPassword: password
            }
        });
        res.send(user);
    }
    catch (error) {
        next(error);
    }
});
authRouter.post('/login', async (req, res, next) => {
    res.send("login route");
});
authRouter.post('/refresh-token', async (req, res, next) => {
    res.send("refresh token route");
});
authRouter.delete('/logout', async (req, res, next) => {
    res.send("Logout route");
});
