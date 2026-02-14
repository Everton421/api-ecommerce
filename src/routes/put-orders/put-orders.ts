import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import {    items, orders, statusOrder } from "../../database/schema.ts";
import { db } from "../../database/client.ts";
import { eq, sql } from "drizzle-orm";

export const putOrderRoute: FastifyPluginAsyncZod = async  ( server ) =>{
    
    server.put('/orders/:id', {
        schema:{
            tags:['orders'],
            params: z.object({
                id: z.string()
            }),
            body:z.object({
                userId: z.number(),
                total:z.number(),
                status: z.enum(["cancelled","delivered", "shipped", "processing" ,"pending"]),
                addres:z.number(),
                shipping:z.number(),
                payment:z.enum(['pending','authorized']),
                tracking_id: z.string(),
                updatedAt: z.string(),
                items: z.array(
                    z.object({
                    productId:z.number(),
                    quantity:z.number(),
                    price: z.number(),
                    offerPrice: z.number()
                    })
                )
            })
        }
    },
    async ( request ,reply )=>{

        const { id } = request.params

        const {  payment, shipping, status, total, tracking_id, updatedAt, userId } = request.body

        const orderItems = request.body.items;

        const addresId= request.body.addres;

        const verifyOrder = await db.select().from(orders).where( eq( orders.id , Number(id)))

        if(verifyOrder.length === 0 ){
            return reply.status(400).send({ error: `No order was found with ID: ${id}`});
        }
            
 
               let resultUpdateOrder = await db.update(orders).set(
                {
                    userId: userId,
                    total: String(total),
                    status: status,
                    addres: Number(addresId) ,
                    shipping:String(shipping),
                    payment: payment,
                    tracking_id: tracking_id,
                    updatedAt:sql`NOW()`
                }).where( eq(orders.id, Number(id)));
                

                let resultDelete = await db.delete(items).where(  eq(items.orderId, Number(id) ) )

                    if( orderItems.length > 0  ){
                        for( const i of orderItems){

                            const objItem = {
                                orderId:  id ,
                                    productId: Number(i.productId),
                                    quantity: Number(i.quantity),
                                    offerPrice: Number(i.offerPrice),
                                    price: Number(i.price)
                            } as any

                            await db.insert(items).values(objItem )
                        }
                    }

                    return reply.status(200).send();

    })
}