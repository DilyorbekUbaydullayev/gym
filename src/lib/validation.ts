import { title } from "process"
import { z } from "zod"

export const loginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6)
})

export const registerScheme= z.object({
    email:z.string().email(),
    password:z.string().min(6),
    confirmPassword:z.string(),
}).refine(data=>data.password===data.confirmPassword,{
    message:"Password don't match",
    path:['confirmPassword'],
})

export const taskSchema = z.object({
    title:z.string().min(5),
    timer:z.string().min(2)
})