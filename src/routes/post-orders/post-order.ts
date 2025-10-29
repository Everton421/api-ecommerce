import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { orders, statusOrder } from "../../database/schema.ts";
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
    const {  createdAt, items,payment,shipping,status,total,tracking_id} = request.body

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
        console.log(resultInsertOrder);

    }catch(e){
        console.log("Erro: " , e );

    }


        reply.status(200)

 }
)
}