import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../../database/client.ts"
import { products, products_imgs } from "../../database/schema.ts"
import z, { promise } from "zod"
import { and, eq, gt, gte, like, or, SQL } from "drizzle-orm"
import { transformProduct } from "../../utils/transform-product.ts"


  type productImg =  {
    id:number
    name:string | null 
    description:string | null 
    price:string
    offerPrice:string
    category:string
    createdAt:   Date
    updatedAt:   Date
    imgs:imgsProduct[]  
} 
   type product  =  {
    id:number
    name:string | null 
    description:string | null 
    price:string
    offerPrice:string
    category:string
    createdAt:   Date
    updatedAt:    Date
} 
  type imgsProduct = {id:number, productId:number, imgUrl:string  }


export const getProductsRoute:FastifyPluginAsyncZod   = async ( server ) =>{
    server.get('/products',{
        schema:{
            tags:['products'],
            querystring: z.object({
                search: z.string().optional(),
                updatedAt: z.string().optional(),
                category: z.string().optional(),
            }),
            response:{
                200: z.array(
                    z.object({
                        id: z.number(),
                        name: z.string().nullable(),
                        description: z.string().nullable(),
                        price: z.string(),
                        offerPrice: z.string(),
                        category: z.string(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                        imgs: z.array(
                                z.object({
                                    id:z.number(),
                                    productId:z.number(),
                                    imgUrl:z.string()
                                })
                         ) 
                     }), 
                ),
                    400: z.object({ error: z.string()})
            }
        }
    }
, async (request, reply )=>{

        const {  search, updatedAt, category  } = request.query

            const conditions:SQL[] =[];


        if(search   ){
            const searchTerm = `%${search}%`
            const searchConditions = or(
                like(products.name, searchTerm),
                like(products.description, searchTerm),
                like(products.category, searchTerm),
            )
            
            if(searchConditions ){
                conditions.push(searchConditions);
            }
        }

              if(updatedAt){
                const updatedAtProduct =  new Date(updatedAt) 
                console.log(updatedAtProduct.getTime())
                        if(isNaN(updatedAtProduct.getTime())){
                            return reply.status(400).send({ error:'Invalid updatedAt date format.'})
                        }
                    conditions.push( gte(   products.updatedAt ,updatedAtProduct  ) )
                 }
               if(category){
                    conditions.push(eq(products.category, category))
                 }

                    const [ resultProducts, resultImgs ] = await Promise.all([
                         db.select()
                            .from(products)
                            .where( conditions.length > 0 ? and(...conditions) : undefined) ,

                            db.select().from(products_imgs)
                    ])

                    const arrProducts: productImg[] =[]

                    if( resultProducts.length > 0 ){
                        for(const p of resultProducts ){
                                let auxProd:productImg =  transformProduct(p) 

                           const imgs = resultImgs.filter((i)=> i.productId === p.id)
                                auxProd.imgs = imgs  

                           arrProducts.push( auxProd )  
                        }
                    }

        return reply.status(200).send( arrProducts)

    }
)
}

