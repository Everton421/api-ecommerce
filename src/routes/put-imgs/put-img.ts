import {type  FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { products, products_imgs } from "../../database/schema.ts";
import { eq, sql } from "drizzle-orm";

export const putImageRoute: FastifyPluginAsyncZod = async ( server ) =>{

    server.put('/product/:product/img',{
        schema:{
                tags:['products'],
                params: z.object({
                    product: z.string()
                }),
                body: z.object({
                    imgs: z.array(
                        z.object({
                            id: z.number().describe('Id da imagem vinculada ao produto'),
                            imgUrl: z.string()
                        })
                    )
                })
        }
    },
    async ( request, reply )=>{
            const { product } = request.params;
            const { imgs } = request.body

                const resultImgsProduct = await db.select().from(products_imgs).where( eq(products_imgs.productId, Number(product)))

                    if(resultImgsProduct.length > 0 ){
                        for(let i of imgs){
                            await db.delete(products_imgs).where(eq(products_imgs.id, Number(i.id) ))
                        }   
                    }
                        const resultUpdateImg = []
                    for(let i of imgs){
                       const resultInsertImg =  await db.insert(products_imgs).values({
                                imgUrl:i.imgUrl,
                                productId: Number(product),
                                createdAt: sql`NOW()`,
                                updatedAt: sql`NOW()`
                            }).$returningId()
                        resultUpdateImg.push(resultInsertImg[0])

                        }   
                        return reply.status(200).send(resultUpdateImg)
            }
)
} 