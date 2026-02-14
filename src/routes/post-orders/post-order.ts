import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { items, orders, statusOrder } from "../../database/schema.ts";
import { db } from "../../database/client.ts";
import { SQL, sql } from "drizzle-orm";



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
                userId:z.number(),
                createdAt:z.string().optional(),
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

    const {  createdAt, userId, addres,  payment,shipping,status,total,tracking_id} = request.body;
    const itemsOrder = request.body.items;
     
 
    let auxCreatedAt : string | SQL<unknown>   = sql`NOW()`;
        if(createdAt){
            const createdAtOrder = new Date(createdAt);
            if( isNaN( createdAtOrder.getTime())){
                return reply.status(400).send({ error:"Invalid createdAt date format."})
            }
            auxCreatedAt = createdAt;
        }
         
          const newOrder = {
            addres: Number(request.body.addres) ,
            userId: Number(request.body.userId),
            total: String(total),
            status: status,
            tracking_id: tracking_id,
            createdAt:  auxCreatedAt  ,
            payment: payment,
            shipping: shipping,
            updatedAt: sql`NOW()`
        }  as any // Adiciona a tipagem explícita
try{

 const resultInsertOrder = await db.insert(orders).values(newOrder  ).$returningId();
       
         const order_Id  = Number(resultInsertOrder[0].id);
      
       if(order_Id && order_Id > 0 ){
             
                 for( let i=0; i< itemsOrder.length; i++ ){
                     const item = itemsOrder[i]  ;
                     
                     const object = {
                          orderId:order_Id ,
                         productId: item.productid,
                         quantity: item.quantity,
                         price:  String(item.price)  ,
                         offerPrice: String(item.offerprice) 
                     } satisfies  typeof items.$inferInsert;
 
                     await db.insert( items ).values( object)
              }
             }
          
        return reply.status(200).send(resultInsertOrder)

}catch(e){
        
        return reply.status(500).send( )

}
   
 

 } 
)
}