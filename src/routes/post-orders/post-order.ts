import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { items, orders, statusOrder } from "../../database/schema.ts";
import { db } from "../../database/client.ts";
import { sql } from "drizzle-orm";



export const postOrdersRoute : FastifyPluginAsyncZod = async ( server )=>{
    server.post('/orders', {
        schema:{
            tags:['orders'],
            body: z.object({
                status: z.enum( [ "cancelled","delivered", "shipped", "processing" ,"pending"]),
                total:z.number(),
                shipping:z.number(),
                payment: z.enum(['pending','authorized']),
                tracking_id: z.string(),
                addres: z.number(),
                createdAt:z.date().optional(),
                items: z.array(
                    z.object({
                        productid: z.number(),
                        quantity: z.number(),
                        price: z.number(),
                        offerprice:z.number()
                    })
                )
            })
        }
    },
 async (request, reply )=>{
    const {  createdAt,   payment,shipping,status,total,tracking_id} = request.body;
    const itemsOrder = request.body.items;
    try{

    const resultInsertOrder = await db.insert(orders).values({
            addres:1,
            userId:1,
            total: total,
            status: status,
            tracking_id: tracking_id,
            createdAt:sql`NOW()`,
            payment:payment,
            shipping:shipping,
            updatedAt: sql`NOW()` 
        }).$returningId();
         console.log(resultInsertOrder[0].id);
         
         const idOrder = resultInsertOrder[0].id;

        if( idOrder > 0 ){
            
                for( let i=0; i< itemsOrder.length; i++ ){
                    const item = itemsOrder[i];
                    await db.insert( items ).values({
                        orderId: Number(resultInsertOrder[0].id),  
                        productId: item.productid,
                        quantity: item.quantity,
                        price: item.price,
                        offerPrice: item.offerprice 
                        
                    })
             }
            }

    }catch(e){
        console.log("Erro: " , e );

    }


        reply.status(200)

 }
)
}