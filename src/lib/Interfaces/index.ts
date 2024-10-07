import { Request } from "express";

interface customRequest extends Request{
    payload: {
        user: string
    }
}

export {customRequest};