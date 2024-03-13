import { createClient,defineScript } from 'redis';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts : {
		addOneAndStore: defineScript({
			NUMBER_OF_KEYS:1,
			SCRIPT: `
			  local keyToAssignIncrementedNumberTo = KEYS[1]
			  local argumentValueToBeSet = 1 + tonumber(ARGV[1])
			  return redis.call('SET',keyToAssignIncrementedNumberTo,argumentValueToBeSet)
			`,
			transformArguments(key: string,value: number){
				return [key, value.toString()]
			},
			transformReply(reply: any){
				return reply
			}
		})
	}
});

client.on('error', (err) => console.error(err));
client.connect();

export { client };
