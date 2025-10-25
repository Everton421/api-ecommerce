import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z, { number } from "zod"
import { db } from "../../database/client.ts"
import { products, products_imgs } from "../../database/schema.ts"
import { SQL, sql } from "drizzle-orm"

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
                imgs:z.array(
                    z.string()
                ).optional()
            }),
            response:{
                201: z.object({id:z.number()}),
                500:z.object()
            }
        }
    },
    async ( request, reply )=>{

              const { category, description, name  ,offerPrice,price, imgs} = request.body

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
                const id = resultInsertProduct[0].id; 
                    if(id > 0 ){
                        if( imgs && imgs.length > 0 ){
                             imgs.forEach( async (i)=>{
                                    await db.insert(products_imgs).values(
                                        {
                                            imgUrl:i,
                                            productId: id,
                                            createdAt: sql`NOW()`,
                                            updatedAt: sql`NOW()`
                                        }
                                    )
                             })
                        }

                    }
                    reply.status(201).send({id: id})
                }catch(e){
                console.log("Erro ao tentar registrar o produto", e )
                    reply.status(500).send()

                }

        }
)
}