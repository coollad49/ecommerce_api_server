import {z} from "zod";

const AuthSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
})

export {AuthSchema}