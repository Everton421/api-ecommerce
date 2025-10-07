import fastify from "fastify";
import { getProductsRoute } from "./routes/get-products/get.products.ts";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
import { getProdutctByIdRoute } from "./routes/get-product-by-id/get-product-by-id.ts";
import { postProductRoute } from "./routes/post-products/post-product.ts";
import {  putProductRoute } from "./routes/put-product/put-product.ts";
const server = fastify({
    logger: false 
     // { 
      //  transport:{
      //      target: 'pino-pretty',
      //      options:{
      //          colorize:true,
      //          translateTime:'HH:MM:ss Z',
      //          ignore:'pid,hostname'
      //        }
      //  }
      //}
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
 
 server.register(putProductRoute);

server.register(postProductRoute)
server.register(getProductsRoute)
server.register(getProdutctByIdRoute)
export {server  }