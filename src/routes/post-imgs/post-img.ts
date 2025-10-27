import { type  FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { products, products_imgs, typeImg } from "../../database/schema.ts";
import { eq, sql } from "drizzle-orm";

export const postImageRoute : FastifyPluginAsyncZod = async (server)=>{

      server.post('/product/:product/img',{
        schema:{
                tags:['products'],
                 params: z.object({
                              product: z.string()
                          }),
                  body: z.object({
                        imgs:z.array(
                            z.object({
                                imgUrl:z.string(),
                                typeImg: z.enum(['catalog', 'specification'])
                            }) 
                        ).describe('Array com as URLS das imagems.')
                })        
        }
    }, 
    async ( request, reply)=>{
            const { product } = request.params;
                        
            const validProduct = await db.select().from(products).where(eq(products.id, Number(product) ))  

                if( validProduct.length === 0 ) return  reply.status(400).send({ error: `Product ${product} not found.`});

                const { imgs } = request.body 
               
                    const returnInsertImgs = []
                 for( const e of imgs ){
                       const resultInsertImg= await db.insert(products_imgs).values({
                            imgUrl: e.imgUrl,
                            typeImg: e.typeImg,
                            productId:Number(product),
                            createdAt:sql`NOW()`,

                            updatedAt:sql`NOW()` 
                    }).$returningId()
                    returnInsertImgs.push(resultInsertImg[0])
                 }

                 if(returnInsertImgs.length > 0 ){
                    return reply.status(200).send(returnInsertImgs) 
                 } 

    }
)
}