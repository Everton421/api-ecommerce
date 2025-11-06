import fastify from "fastify";
import { getProductsRoute } from "./routes/get-products/get.products.ts";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
import { getProdutctByIdRoute } from "./routes/get-product-by-id/get-product-by-id.ts";
import { postProductRoute } from "./routes/post-products/post-product.ts";
import {  putProductRoute } from "./routes/put-product/put-product.ts";
import { postImageRoute } from "./routes/post-imgs/post-img.ts";
import { putImageRoute } from "./routes/put-imgs/put-img.ts";

import path from 'node:path'
import fs from 'node:fs'
import cors from '@fastify/cors'
import { postOrdersRoute } from "./routes/post-orders/post-order.ts";
import { getOrdersRoute } from "./routes/get-orders/get-order.ts";
import { putOrderRoute } from "./routes/put-orders/put-orders.ts";

let certPathEnv;
if(process.env.PATH_CERT) certPathEnv = String(process.env.PATH_CERT)

let keyPathEnv 
if(process.env.PATH_KEY) keyPathEnv = String(process.env.PATH_KEY)

let httpsOptions ={}
if( process.env.NODE_ENV === 'production' && keyPathEnv && certPathEnv ){
    const keyPath = path.join(keyPathEnv);
    const certPath = path.join(certPathEnv);
    
    httpsOptions= {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    }
}


  let server  
if( process.env.NODE_ENV === 'production' && keyPathEnv && certPathEnv ){
      server = fastify({
    https: httpsOptions,
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
}else{
      let server = fastify({
    logger: false 

    })
}
 
if(!server ){
    throw new Error("Falha ao tentar configurar o servidor")

}
    
 server.register( fastifySwagger,{
    openapi:{
        info:{
            title:"API E-commerce",
            version:"1.0.0"
        }
    },
    transform: jsonSchemaTransform,
 })

 
server.register(cors,{
    origin:'*',
    methods:'*'
})
 server.register( scalarAPIReference,{ routePrefix:'/docs' } )

 server.setSerializerCompiler(serializerCompiler);

 server.setValidatorCompiler( validatorCompiler )
 server.register(putImageRoute);
 server.register(putProductRoute);
server.register(postImageRoute);
server.register(postProductRoute)
server.register(getProductsRoute)
server.register(getProdutctByIdRoute)
server.register(postOrdersRoute)
server.register(getOrdersRoute)
server.register(putOrderRoute)

export {server  }