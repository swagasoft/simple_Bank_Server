import  config from "config";
import  {connect, ConnectOptions, connection} from "mongoose";


const connectDb =async () => {

    try {
        const mongodb_uri: string = config.get('MONGODB_URI');
        const options: ConnectOptions = {
            // useCreateIndex: true
          };
        await connect(mongodb_uri,options);
        console.log("MongoDB Connected... to ", mongodb_uri);
        
    } catch (error: any) {
        console.error('DB connection error ',error.message);
        process.exit(1);
    }
    
}

connectDb();




export default connectDb;