import fastify from "fastify";
import { getPtroductsRoute } from "./routes/get-products/get.products.ts";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
const server = fastify({
    logger: { 
        transport:{
            target: 'pino-pretty',
            options:{
                colorize:true,
                translateTime:'HH:MM:ss Z',
                ignore:'pid,hostname'
              }
        }
    }
}).withTypeProvider<ZodTypeProvider>()

 server.register( fastifySwagger,{
    openapi:{
        info:{
            title:"API E-commerce",
            version:"1.0.0"
        }
    },
    transform: jsonSchemaTransform,
 })

 server.register( scalarAPIReference,{ routePrefix:'/docs' } )

 server.setSerializerCompiler(serializerCompiler);

 server.setValidatorCompiler( validatorCompiler )

server.register(getPtroductsRoute)
export {server  }