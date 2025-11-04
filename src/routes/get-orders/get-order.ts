          //      status: z.enum( [ "cancelled","delivered", "shipped", "processing" ,"pending"]),

          import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod" 
import z, { date } from "zod"
import { addres, items, orders } from "../../database/schema.ts"
import { db } from "../../database/client.ts"
import { and, eq, gte, SQL } from "drizzle-orm"

          type order = typeof orders  
          type orderItems = typeof items
          type resultOrder= order &  orderItems[] | []

 


          export const getOrdersRoute:FastifyPluginAsyncZod = async ( server  )=>{

                server.get('/orders', {
                        schema:{
                            tags:['orders'],
                            querystring: z.object({
                                userId:z.string().optional(),
                                status: z.enum( [ "cancelled","delivered", "shipped", "processing" ,"pending"]).default('processing').optional(),
                                id: z.string().optional(),
                                updatedAt: z.string().optional().describe('Obtem itens com data de atualização > ou = a data informada. Ex.: [ 2025-10-20 ]: trará itens que sofreram alteração em 2025-10-20 ou posteriomente.'),
                                tracking_id: z.string().optional()
                            }),

                        }
                    
                }, async ( request , reply ) =>{

                    const  { id, status, tracking_id, updatedAt, userId } = request.query

                        const conditions:SQL[] = [];

                            if(id){
                                conditions.push( eq(orders.id,Number(id)  ));
                            }
                            if(status){
                                conditions.push( eq( orders.status, status));
                            }
                            if(tracking_id){
                                conditions.push( eq( orders.tracking_id, tracking_id));
                            }
                            if(userId){
                                conditions.push( eq( orders.userId, Number(userId)));
                            }

                            if( updatedAt){
                                const updatedAtOrder = new Date( updatedAt);
                                    if(isNaN( updatedAtOrder.getTime())){
                                        return reply.status(400).send({error: "Invalid updatedAt date format."})
                                    }
                                    conditions.push( gte( orders.updatedAt, updatedAtOrder));
                            }

                            
                        const result = await db.select()
                        .from(orders)
                        .where( conditions.length > 0 ? and(...conditions) : undefined)
                            
                              let arrorders:any[] =[]
                   for( let i of result ){
                         const orderItems = await db.select().from(items).where( eq(items.orderId, i.id))
                         const addresOrder = await db.select(
                            {
                                 phoneNumber:addres.phoneNumber,
                                 zipCode: addres.zipCode, 
                                 road: addres.road,
                                 number: addres.number,
                                 neighborhood: addres.neighborhood,
                                 city :addres.city,
                                  state: addres.state  
                                }).from(addres).where( eq(  addres.id, i.addres ))
                //        
                        let aux = i as any
                        aux = { ...aux,  items:  orderItems  };
                                aux = { ...aux , addres: addresOrder[0]}
                        arrorders.push(aux);
                   }
                    

                    return reply.status(200).send( arrorders)



                })  

          }