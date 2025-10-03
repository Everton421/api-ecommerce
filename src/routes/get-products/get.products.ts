import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"

export const getPtroductsRoute:FastifyPluginAsyncZod   = async ( server ) =>{
    server.get('/products',{
        schema:{
            response:{

            }
        }
    }
, async (request, reply )=>{

     return reply.send({ok:true})
}
)
}