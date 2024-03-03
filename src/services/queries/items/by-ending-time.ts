import { itemsByEndingSoonestKey, itemsKey } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from "./deserialize";
import { getItems } from "./items";

export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	const ids = await client.zRange(
		itemsByEndingSoonestKey(),
		Date.now(),
		'+inf',
		{
			BY : 'SCORE',
			LIMIT : {
				offset,
				count
			}
		});
		return await getItems(ids);
};
