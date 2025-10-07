import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { products } from "../../database/schema.ts";
import { eq } from "drizzle-orm";

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
                    createdAt: z.date(),
                    updatedAt:z.date()
                })
            }
        }
    } , async ( request, reply ) =>{

            const { id } = request.params
            const product = await db.select().from(products).where(eq(products.id, Number(id) ))
            console.log(product)
                return reply.status(200).send(product[0])
        }   

)
}