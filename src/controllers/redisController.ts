const redis = require("redis");
const { promisifyAll } = require('bluebird');
promisifyAll(redis);


//  cloud redis
const client = redis.createClient({
    port: process.env.REDIS_PORT ,
    host: process.env.REDIS_HOST,
   password:process.env.REDIS_PASSWORD 
  });

// local redis
  // const client = redis.createClient({
  //   port: process.env.REDIS_PORT || '6379',
  //   host: process.env.REDIS_HOST || '127.0.0.1',
  // });




  console.log('Starting redis ')
  client.on('connect', () => {
    //   client.select(5)
    console.log('Redis client connected');
  });
  

  client.on('error', (err: Error) => {
    console.log(`Something went wrong with Redis ${err}`);
  });


  export const saveToRedisCache = (key: string, data: any) => {
    client.set(key, JSON.stringify(data));
};


export const saveToRedisFor15minutes = (key: any, data: any) => {
    client.setex(key, 900, JSON.stringify(data))
};


export const saveToRedisForOneHour = (key: any, data: any) => {
    client.setex(key, 3600, JSON.stringify(data))
};


export const getDataFromRedis = async (key: any) => {
  const response: any =  await new Promise((resolve, reject) => {
        client.get(key, (error: Error, data: any) => {
          if(error){
          return  reject(error);
          }
        return  resolve(data);
        });
      });
     return JSON.parse(response);
};


const getAllKeys = () => {
    return client.keys('*');
}


export const deleteRedisRecord = (key: any) => {
    client.del(key);
}



saveToRedisCache('test', 'new testing...')
var test = getDataFromRedis('test').then(data => { console.log('See ', data)})

