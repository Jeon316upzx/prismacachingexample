import express, { Application, Request, Response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();

import { createLRUCacheMiddleware } from "prisma-lrucache-middleware";
import LRU from "lru-cache";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const myCache = new LRU(50);


prisma.$use(createLRUCacheMiddleware({ model: `User`, cache: myCache }));



const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/all-user", async (req: Request, res: Response) => {

    const allUsers = await prisma.user.findMany()
    return res.json({
        message: "all users",
        data: {
            users: allUsers
        },
    })

});

const PORT: any = process.env.PORT || 3000

app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
});
