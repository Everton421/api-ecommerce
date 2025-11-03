          //      status: z.enum( [ "cancelled","delivered", "shipped", "processing" ,"pending"]),

          import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod" 
import z from "zod"
import { items, orders } from "../../database/schema.ts"
import { db } from "../../database/client.ts"
import { eq } from "drizzle-orm"

          type order = typeof orders  
          type orderItems = typeof items
          type resultOrder= order &  orderItems[] | []

 


          export const getOrdersRoute:FastifyPluginAsyncZod = async ( server  )=>{

                server.get('/orders', {
                        schema:{
                            tags:['orders'],
                            querystring: z.object({
                                userId:z.number().optional(),
                                status: z.enum( [ "cancelled","delivered", "shipped", "processing" ,"pending"]).default('processing').optional(),
                                id: z.number().optional(),
                                tracking_id: z.string().optional()
                            }),

                        }
                    
                }, async ( request , reply ) =>{
                    
                        const result = await db.select()
                        .from(orders)
                        .innerJoin(items, eq(orders.id, items.orderId))

                        console.log(result )
                        
                        let order: resultOrder

                                 
                        for(const i of result){
                              order  = i.orders
                            order.items.push(i.items); 
                        }

                    return reply.status(200).send(order)



                })  

          }