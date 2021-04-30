import jwt from 'jsonwebtoken';
import { NextFunction, Request , Response } from 'express';

interface UserPayload { id : string, email : string }

declare global{
    namespace Express{
        interface Request{
            currentUser? : UserPayload
        }
    }
}

export const currentUser = ( req : Request , res : Response , next : NextFunction ) => {

    const { authorization } = req.headers;
    let token: string = "";

    if(authorization){
        token = (authorization!.split(" "))[1]
    }

    if(token){
        const payload = jwt.verify(token ,  process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    }

    if(req.session?.jwt){
        const payload = jwt.verify(req.session.jwt ,  process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    }

    next();
}