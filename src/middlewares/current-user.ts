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
        try {
            token = (authorization!.split(" "))[1]
        } catch (err) { }
    }

    if(token){
        try {
            const payload = jwt.verify(token ,  process.env.JWT_KEY!) as UserPayload;
            req.currentUser = payload;
        } catch (err) {}
      
    }

    if(req.session?.jwt){
        try {
            const payload = jwt.verify(req.session.jwt ,  process.env.JWT_KEY!) as UserPayload;
            req.currentUser = payload;
        } catch (err) {}
    }

    next();
}