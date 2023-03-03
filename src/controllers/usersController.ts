
import { generateRefreshToken, tokenDecoderHelper, verifyTokenIfExpire } from './../../config/jwtHelpers';
import { UsersInterface } from '../models/userModel';
import usersModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import Cryptr from 'cryptr';
import { generateAccessToken } from '../../config/jwtHelpers';
import { validateLogin, validateUserRecord } from './validationController';
import  config from "config";
import { deleteRedisRecord, getDataFromRedis } from './redisController';
import jwt_decode from "jwt-decode";

const cryptr = new Cryptr('myTotalySecretKey');




export const login = async(req: Request, res: Response, done :NextFunction )=> {
   
    const userData: UsersInterface = req.body;
    const validationConfirmed =  await validateLogin(userData);
    if(!validationConfirmed){
        return res.status(422).send({msg: "one or more value is required!"});
    }

    let email = req.body.email.toLowerCase();
    let password = req.body.password;

    try {
      usersModel.findOne({email:email},(error: any, user : UsersInterface)=> {
        //  unknown user
        if(!user){
          res.status(404).send({msg:'user not found!'});
        }else{
      let databasePassword = user.password;
      let decrypePass = cryptr.decrypt(databasePassword);
      
          if(decrypePass === password){
          const  accessToken =  generateAccessToken(user);
          const  refreshToken = generateRefreshToken(user);
            // send user role to client...
            res.status(200).send({"accessToken":accessToken, "refreshToken":refreshToken });
      
          }else{
            res.status(401).send({msg: ' Invalid User Credentials.'});
          }
      }
      });
      
    } catch (error) {
      res.status(400).send({msg: ' Cannot process login.'});
    }
  

    }



    export   const createUser = async(req: Request , res: Response)=> {
      
        const userData: UsersInterface = req.body;
      try {
        
        const validationConfirmed =  validateUserRecord(userData);
        if(!validationConfirmed){
            return res.status(422).send({msg: "one or more value is required!"});
        }
  
      var  user = new usersModel();
        user.email = req.body.email.toLowerCase();
        user.name = req.body.name.toLowerCase();
        let crypePassword = cryptr.encrypt(req.body.password);
        user.password = crypePassword;
        user.save((err: any, success: any)=> {
          if(err){
            if(err?.code === 11000){
              return res.status(500).send({msg:"Error - User already exist!!", });
            }else{
              return res.status(500).send({msg:" Registration fail!!", err});
            }

          }else{
            return  res.status(200).send({msg: "Registration successful"});
          }

        });
   
      } catch (error) {
        res.status(500).send({message:" Something went wrong!"});
        
      }

     
      }

 
  
      export   const deleteRefreshToken =  async (req: Request, res: Response)=> {
        const tokenKey = req.params.key;
        if(tokenKey){
          await deleteRedisRecord(tokenKey);
          res.status(200).send({msg: "Refresh token has been deleted!"});
        }else{
          res.status(422).send({msg: "Failed to delete user refresh token!"});
        }
        
      }
  

   
       export   const refreshTokenProcess = async (req: Request | any, res: Response)=> {
        const refreshToken = req.body.token;

        const isTokenValid = verifyTokenIfExpire(refreshToken);
        if(!isTokenValid){
          return res.status(401).send("Expired token!");
        }

        if(refreshToken){
          const tokenDecoded: any = await tokenDecoderHelper(refreshToken);
          if(!tokenDecoded?.id){
            return res.status(401).send("Invalid token supply!");
          }

          const currentUser: UsersInterface| null = await usersModel.findOne({_id:tokenDecoded?.id});
          const isTokenValid = await verifyTokenIfExpire(refreshToken);
  
          if(!isTokenValid){
           return  res.status(401).send({msg: "Refresh token is expired!"});
          }
  
          const newAccessToken =await generateAccessToken(currentUser);
          res.status(200).send({"accessToken":newAccessToken });
        }else{
          return  res.status(422).send({msg: "Please provide a refresh token!"});
        }
      
       }



      export const getUserBalance = async (req: any, res: Response) => {
            const currentUser = req?.user;
      try {
        
        const userObject: UsersInterface | null = await usersModel.findById({_id: currentUser._id});
        res.status(200).send({balance: userObject!.balance});
      } catch (error) {
        res.status(404).send({msg:" no user record!"});
      }


      }


      export const getAllUsers = async (req:Request, response: Response) => {
        const allUsersList : Array<UsersInterface | null> = await usersModel.find({});
        response.status(200).send( allUsersList);
      }



export const processTransaction = async (req: any, res: Response) => {
     
      const beneficiaryEmail = req.body.email.toLowerCase();
      const amount = parseInt(req.body.amount);

      if(!beneficiaryEmail ||  !amount){
        return res.status(422).send({msg: "Failed, please provide amount and beneficiary email!"});
      }

      const  beneficiaryUserObject : UsersInterface | null = await usersModel.findOne({email:beneficiaryEmail});

      if(!beneficiaryUserObject){
        return res.status(422).send({msg: " beneficiary email not found!"});
      }
      const currentUserObject: UsersInterface | null  = await usersModel.findOne({_id:req._id});
      if(currentUserObject!.balance < amount){
        return res.status(422).send({msg: "Insufficient balance!"});
      }

    
      currentUserObject!.balance =  currentUserObject!.balance - amount;
      beneficiaryUserObject!.balance = beneficiaryUserObject!.balance + amount;
      await currentUserObject!.save();
      await beneficiaryUserObject!.save();

      res.status(200).send({msg:"Transaction successful", newBalance: currentUserObject!.balance});

}


   
  

