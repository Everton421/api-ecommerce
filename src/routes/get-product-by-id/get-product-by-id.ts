import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { products, products_imgs, typeImg } from "../../database/schema.ts";
import { eq } from "drizzle-orm";
import { transformProduct } from "../../utils/transform-product.ts";
  type productImg =  {
    id:number
    name:string | null 
    description:string | null 
    price:string
    offerPrice:string
    category:string
    specifications:string | null 
    createdAt:   Date
    updatedAt:   Date
    imgs:imgsProduct[]  
} 
  type imgsProduct = {id:number, productId:number, imgUrl:string , typeImg: 'catalog' | 'specification' }


export const getProdutctByIdRoute :FastifyPluginAsyncZod = async ( server ) =>{
    server.get('/products/:id',{
        schema:{
            tags:['products'],
            params: z.object({
                id: z.string()
            }),
            response:{
                200: z.object({
                    id:z.number(),
                    name: z.string().nullable(),
                    description: z.string().nullable(),
                    price: z.string(),
                    offerPrice:z.string(),
                    category:z.string(),
                    specifications:z.string().nullable(),
                    createdAt: z.date(),
                    updatedAt:z.date(),
                    imgs: z.array(
                        z.object({
                            id: z.number(),
                            productId:z.number(),
                            imgUrl:z.string(),
                            typeImg: z.enum(['catalog', 'specification']) 
                        })
                    )
                })
            }
        }
    } , async ( request, reply ) =>{

            const { id } = request.params

                const [ resultProducts, resultImgs ] = await Promise.all([
                    db.select().from(products).where(eq(products.id, Number(id) )),
                    db.select().from(products_imgs).where( eq(products_imgs.productId, Number(id) ))
                ])

                    let productImg: productImg
                if(resultProducts.length > 0 ){
                        productImg = transformProduct(resultProducts[0],resultImgs)
              
                      return reply.status(200).send(productImg   )
                    }

        }   

)
}