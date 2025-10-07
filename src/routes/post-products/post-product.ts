import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z, { number } from "zod"
import { db } from "../../database/client.ts"
import { products } from "../../database/schema.ts"
import { sql } from "drizzle-orm"

export const postProductRoute:FastifyPluginAsyncZod = async ( server )=>{
    server.post('/product',{
        schema:{
            tags:['products'],
            body: z.object({
                description: z.string(),
                name:z.string(),
                price: z.number(),
                offerPrice: z.number(),
                category: z.string(),
            }),
            response:{
                201: z.object({id:z.number()}),
                500:z.object()
            }
        }
    },
    async ( request, reply )=>{

              const { category, description, name  ,offerPrice,price} = request.body

        if(!name || name === '' ) return

            try{    
                const resultInsertProduct = await db.insert(products)
                .values({
                     name:name as string ,
                     description: description, 
                     offerPrice: Number(offerPrice).toFixed(2) ,
                     price:Number(price).toFixed(2),
                     category:category,
                     createdAt:sql`NOW()`,
                     updatedAt:sql`NOW()`,
                     
                }).$returningId()
                console.log(resultInsertProduct )
                    reply.status(201).send({id: resultInsertProduct[0].id})
                }catch(e){
                console.log("Erro ao tentar registrar o produto", e )
                    reply.status(500).send()

                }

        }
)
}