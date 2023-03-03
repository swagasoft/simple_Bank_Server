import { saveToRedisCache, getDataFromRedis } from './../src/controllers/redisController';
import  config from "config";
import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');




export const verifyJwtToken = async (req: any, res: Response, next: NextFunction)=> {
    var accessToken;
    if('authorization' in req.headers)
    accessToken = req?.headers?.authorization?.split(' ')[1];
    if(!accessToken){
        return  res.status(401).send(({auth: false, message: 'no token provided.'}));
    }

    const tokenDecoded: any = tokenDecoderHelper(accessToken);
    const storeRefreshToken = await getDataFromRedis(tokenDecoded._id);
    const isAccessTokenValid = verifyTokenIfExpire(accessToken);
    const isRefreshTokenValid =await  verifyTokenIfExpire(storeRefreshToken);
  
    
    if(!isAccessTokenValid || !isRefreshTokenValid){
        return res.status(401).send({auth: false, message:'token authentication expired.'});
        
    }else{
        jwt.verify(accessToken, config.get('SECRET'), (error: any, decoded: any)=> {
            if(error){
            return res.status(401).send({auth: false, message:'token authentication failed.'});
             }else{
                req.user = decoded;
                req._id = decoded._id;
                next();
            }
        });
    }
}


export const verifyTokenIfExpire = (token: string): boolean => {
  try {
    const tokenDecoded: any =  tokenDecoderHelper(token);
    if(Date.now() >= tokenDecoded?.exp * 1000) {
            return false
    }
    return true;
  } catch (error) {
    return false;
  }
}


export const tokenDecoderHelper = (token: string): Object| null => {
  try {
    const tokenDecoded: any = jwt.verify(token, config.get('SECRET'));
    return tokenDecoded;
  } catch (error) {
    return  null;
  }
}



export const generateAccessToken = (user: any)=> {
    var expiry = new Date();
    expiry.setDate(expiry.getMinutes() + 3);
    const payload = {_id:user?._id, email: user?.email, role: user?.role, name: user?.name}
     const accessToken = jwt.sign({ ...payload}, config.get('SECRET'),{expiresIn: "15m"}); 
     return accessToken;
}


export const generateRefreshToken = (user: any)=> {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 5);
    const payload = {id:user?._id, email: user?.email, role: user?.role, name: user?.name}
     const refreshToken = jwt.sign({ ...payload}, config.get('SECRET'),{expiresIn: "3h"});
     saveToRedisCache(user._id.toString(), refreshToken); // store refresh token in redis DB
     return refreshToken;
}



export const verifyAdminRole = async(req: any, res: Response, next: NextFunction) => {
   const accessToken = req?.headers?.authorization?.split(' ')[1];
    const payLoad : any =  await tokenDecoderHelper(accessToken);
    const ROLE = payLoad['role'];
    if(ROLE === 'ADMIN'){
        next();
    }else{
        return res.status(401).send({auth: false, message:'Auth token expired!.'});
    }
}




