import { verifyJwtToken, verifyAdminRole } from './../../config/jwtHelpers';
import express,{Request, Response} from  'express';
import  config from "config";
import { login, createUser, deleteRefreshToken, refreshTokenProcess, getUserBalance, processTransaction, getAllUsers } from '../controllers/usersController';





const userRouterController = express.Router();
const API_VERSION = config.get('API_VERSION');


//  Authentication routes
userRouterController.post(`/${API_VERSION}/login`, login);
userRouterController.post(`/${API_VERSION}/create-user`, createUser);
userRouterController.post(`/${API_VERSION}/refresh-token`, refreshTokenProcess);
userRouterController.delete(`/${API_VERSION}/delete-token:key`,deleteRefreshToken);
userRouterController.get(`/${API_VERSION}/get-user-balance`, verifyJwtToken, getUserBalance );
userRouterController.put(`/${API_VERSION}/perform-transaction`, verifyJwtToken , processTransaction);
userRouterController.get(`/${API_VERSION}/get-all-users`, verifyJwtToken , verifyAdminRole, getAllUsers);
userRouterController.delete(`/${API_VERSION}/revoke-user-access:key`, verifyJwtToken , verifyAdminRole, deleteRefreshToken);



export default userRouterController;