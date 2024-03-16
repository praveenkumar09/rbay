import {randomBytes} from 'crypto';
import { client } from './client';

export const withLock = async (key: string,cb : () => any) => {
	const retryDelayInMillis = 100;
	let retries =20;

	//Generate the random value to store the lock key
	const token  = randomBytes(6).toString('hex');
	//Create the lock key
	const lockKey = `lock:${key}`;
	//Set up a while loop to implement the retry behavior
	while(retries >= 0) {
		retries --;
	   //Try to do a SET NX operation
	   const acquired = await client.set(lockKey,token,{
	   NX:true
	});
	if(!acquired){
	   // else brief pause and then retry
	   await pause(retryDelayInMillis);
	   continue;
	}
	//If the set is successfull, then run the callback
	const result = await cb();
	//unset the locked set
	await client.del(lockKey);
	return result;
	}
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
