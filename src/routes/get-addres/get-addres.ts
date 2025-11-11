import { and, eq, gte, like, or, SQL } from "drizzle-orm";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { addres } from "../../database/schema.ts";
import { db } from "../../database/client.ts";


export const getAddresRoute: FastifyPluginAsyncZod = async ( server ) =>{
    server.get('/addres',{
        schema:{
            tags:['addres'],
            querystring:z.object({
               search: z.string().optional(),
               updatedAt: z.string().optional().describe("Obtem endereços com data de atualização > ou = a data informada. Ex.: [ 2025-10-20 ]: trará itens que sofreram alteração em 2025-10-20 ou posteriomente."),
               userId: z.string().optional(),
            }),
           
        }
    },
    async ( request, reply ) =>{
        const { search, updatedAt, userId} = request.query

        const conditions:SQL[] = [];
            
        if(search){
                const searchTerm = `%${search}%`;
                const searchConditions = or(
                    like( addres.city, searchTerm),
                    like(addres.neighborhood, search),
                    like(addres.number, search),
                    like(addres.phoneNumber, search),
                    like(addres.road, search),
                    like(addres.zipCode, search),
                )
                if(searchConditions){
                    conditions.push(searchConditions);
                }
            }
            
            if(userId){
                conditions.push(eq(addres.userId, Number(userId)));
            }
             if(updatedAt){
                 const updatedAtAddres = new Date(updatedAt);
                 if(isNaN( updatedAtAddres.getTime())){
                    return reply.status(400).send({ error: 'Invalid updatedAt date format.'});
                }
                     conditions.push(gte( addres.updatedAt, updatedAtAddres));

                }
             const resultAddres = await db.select().from(addres).where( 
                conditions.length > 0 ? and(...conditions) : undefined
              )
              return reply.status(200).send(resultAddres);



        }   
    )

}