import { UsersInterface } from './../models/userModel';



export const validateUserRecord = (userData: UsersInterface): boolean => {
    if (!userData?.email || !userData?.password || !userData?.name ){
        return false;
    }
    return true;
}


export const validateLogin = (userData: UsersInterface): boolean => {
    console.log("LOG ",userData);
    if (!userData?.email || !userData?.password ){
        return false;
    }
    return true;
}