import { generateRefreshToken } from '../../config/jwtHelpers';
import { UsersInterface } from '../models/userModel';
import usersModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";



   
       export   const processTransaction = async (req: Request | any, res: Response)=> {
         usersModel.findById({_id:req._id}).then((user)=> {
           if(user){
            //  user.password = crypePassword;
             user.save().then(()=> {
               res.status(200).send({msg: 'PASSWORD HAS BEEN CHANGED!'})
             });
           }else{
             res.status(422).send({msg:'error while trying to change password!'})
           }
         });
        
       }

 
   
  

