import { itemsByViewsKey, itemsKey } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from "./deserialize";

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
    let results: any = await client.sort(
        itemsByViewsKey(),
        {
            GET:[
                '#',
                `${itemsKey('*')}->name`,
                `${itemsKey('*')}->views`,
            ],
            BY: 'score',
            DIRECTION: order,
            LIMIT : {
                offset,
                count
            }
        }
    );

    const items = [];
    while(results.length) {
        const [id, name, views, ...rest] = results;  
        const item  =deserialize(id, {name, views});
        items.push(item);
        results = rest;
    }
    console.log(results);
    return items;
};
