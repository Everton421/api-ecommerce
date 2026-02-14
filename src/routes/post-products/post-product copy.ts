import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z, { number } from "zod"
import { db } from "../../database/client.ts"
import { products, products_imgs } from "../../database/schema.ts"
import { SQL, sql } from "drizzle-orm"
import { makeProduct } from "../../factory/factory-product/make-product.ts"
import { makeProductImg } from "../../factory/factory-product/make-product-img.ts"

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
                specifications: z.string().optional(),
                imgs:z.array(
                    z.object({
                        imgUrl: z.string(),
                        typeImg: z.enum(['catalog', 'specification'])
                    })
                ).optional()
            }),
            response:{
                201: z.object({id:z.number()}),
                500:z.object()
            }
        }
    },
    async ( request, reply )=>{

              const { category, description,specifications, name , offerPrice, price ,imgs} = request.body


        if(!name || name === '' ) return

            try{    
               const resultInsertProduct = await makeProduct({
                     name:name as string ,
                     description: description, 
                     offerPrice: offerPrice,
                     price: price ,
                     category:category,
                     specifications: specifications ? specifications : '',
                })


                const id = resultInsertProduct; 
                    if(id > 0 ){
                        if( imgs && imgs.length > 0 ){
                             imgs.forEach( async (i)=>{

                                await makeProductImg(
                                    {
                                        imgUrl:i.imgUrl,
                                        typeImg: i.typeImg,
                                        productId: id,
                                    }
                                );
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