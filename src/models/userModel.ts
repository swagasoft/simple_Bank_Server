
import { Document, model, Model, Schema } from "mongoose";

/**
 * Interface for news Schema for TypeScript.
 * @param email :string
 * @param username :string
 * @param password :string
 * @param role :string
 */


export interface UsersInterface extends Document {
    email: string;
    name: string;
    balance: number;
    password: string;
    role: string
}

const userSchema : Schema = new Schema({
    email:{type: String, required: true ,  unique: true},
    name:{type: String, required: true},
    balance:{type: Number, default:5000},
    password:{type: String, required: true ,   minlength : [6, 'password must be at least 6 character']},
    role :{type: String, default:'USER', enum:['ADMIN','USER']}
},
{
    timestamps: true
});

const usersModel:  Model<any> = model('users', userSchema);

export default usersModel;