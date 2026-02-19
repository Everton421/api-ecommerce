import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { makeUser } from "../../factory/factory-user/make-user.ts";
import { makerAddres } from "../../factory/factory-addres/make-addres.ts";


export const postUserRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/user', {
        schema: {
            tags: ['users'],
            body: z.object({
                email: z.string(),
                name: z.string(),
                phoneNumber: z.string(),
                imageUrl: z.string().optional(),
                type: z.enum(['client', 'admin']).default('client'),
                addres: z.object({
                    zipCode: z.string(),
                    road: z.string(),
                    number: z.number(),
                    neighborhood: z.string(),
                    complement: z.string().optional(),
                    city: z.string(),
                    state: z.string(),

                })
            }),
            response: {
                201: z.object({ id:z.number()}),
                500: z.object({ error: z.string()}),
            }
        }
    },
        async (request, reply) => {
        
            const { type, addres, email, imageUrl, name, phoneNumber } = request.body
                let resultInsertUser=0;

              resultInsertUser = await makeUser(
                {
                    email,
                    imageUrl,
                    name,
                    phoneNumber,
                    type
                }
            );
                const userId = resultInsertUser ;
           
            const { city, neighborhood, number, road, state, zipCode, complement } = addres;
                
                try{

                if (resultInsertUser > 0) {
                    await makerAddres(
                        {
                            userId,
                            city,
                            neighborhood,
                            number,
                            road,
                            state,
                            zipCode,
                            complement
                        }
                    );
                }
                }catch( e:any ){
                    return reply.status(500).send({ 'error': e })
                }  

                return reply.status(201).send({ id: userId});
        
        }


    )
}