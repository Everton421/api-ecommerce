import { and, eq, gte,like, or, SQL } from "drizzle-orm";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z, { email } from "zod";
import { users } from "../../database/schema.ts";
import { db } from "../../database/client.ts";


export const getClientRoute:FastifyPluginAsyncZod = async ( server  ) => {
    server.get('/users',{
        schema:{
            tags:['users'],
            querystring: z.object({
                search:z.string().optional(),
                updatedAt: z.string().optional(),
            }),
            response:{
            200:z.array(
            z.object({
                id:z.number(),
                name:z.string(),
                email:z.string(),
                imageUrl: z.string().nullable(),
                phoneNumber: z.string(),
                createdAt:z.date(),
                updatedAt:z.date(),    
            })
          ),
            400:z.object({
                error: z.string(),
            })
           }
        }
    },
    async ( request ,reply)=>{
        const {   search, updatedAt } = request.query
    
            const conditions: SQL[]=[]
            const searchTerm = `%${search}%`;
      
       if(search){
            
       const searchConditions = or(
            like( users.email, searchTerm),
            like( users.name, searchTerm),
            like( users.phoneNumber, searchTerm),
        )
        if(searchConditions){
                conditions.push(searchConditions);
            }
        }

             
            

              if(updatedAt){
                const updatedAtClient = new Date(updatedAt);
                    if(isNaN( updatedAtClient.getTime())){
                        return reply.status(400).send({error: "Invalida updatedAt date format."});
                      }
                      conditions.push(gte(users.updatedAt, updatedAtClient));
                    }

            conditions.push( eq(users.type, 'client' ) );


                    const resultClient = await db.select(
                        {
                            id: users.id,
                            name:users.name,
                            email:users.email,
                            imageUrl:users.imageUrl,
                            phoneNumber:users.phoneNumber,
                            createdAt:users.createdAt,
                            updatedAt:users.updatedAt
                        } )
                            .from(users)
                            .where( conditions.length > 0 ? and(...conditions  ) : undefined  ) 

 
     
                     return reply.status(200).send(resultClient);
    }
) 



}