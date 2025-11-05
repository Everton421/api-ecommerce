import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { orders } from "../../database/schema";
import { db } from "../../database/client";
import { eq } from "drizzle-orm";

export const putOrderRoute: FastifyPluginAsyncZod = async  ( server ) =>{
    
    server.put('/orders/:id', {
        schema:{
            tags:['orders'],
            params: z.object({
                id: z.string()
            }),
            body:z.object({
                    
            })
        }
    },
    async ( request ,reply )=>{

        const { id } = request.params

        const verifyOrder = await db.select().from(orders).where( eq( orders.id , Number(id)))

        if(verifyOrder.length === 0 ){
            return reply.status(400).send({ error: `No order was found with ID: ${id}`});
        }
         
               await db.update(orders).set(
                {
                    addres:
                }
               )            
         
         

            


    })
}