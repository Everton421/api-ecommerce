import { type  FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { products } from "../../database/schema.ts";
import { eq, sql } from "drizzle-orm";

export const putProductRoute: FastifyPluginAsyncZod = async ( server ) =>{

    server.put('/product/:id', {
        schema:{
                tags:['products'],
                params: z.object({
                        id: z.string()
                }),
                body:z.object({
                    name : z.string(),
                    description: z.string(),
                    price: z.number(),
                    offerPrice: z.number(),
                    category: z.string(),
                }),
                //response:{
                //    200: z.object(),
                //    400:z.object(),
                //    500:z.object()
                //}
            }
        },
        async (request, reply)=>{
            const { id } = request.params
            
            const { category, description, name, offerPrice, price} = request.body

                const verifyProduct = await db.select().from(products).where( eq( products.id, Number(id)  ));

                    if(verifyProduct.length === 0 ) return reply.status(400).send();

                try{
                        const resultUpdateProduct = await 
                        db.update(products)
                        .set({
                            category:category,
                            description:description,
                            name:name,
                            price: Number(price).toFixed(2) ,
                            offerPrice: Number(offerPrice).toFixed(2),
                            updatedAt: sql`NOW()`
                        })
                        .where( eq(products.id, Number(id) )) 
                            return reply.status(200).send();

                }catch(e){
                    console.log(`Erro ao tentar atualizar o produto ${id} `, e )
                    return reply.status(500).send()
                }
        }
)
}