import fastifySwagger from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { getProdutctByIdRoute } from "./routes/get-product-by-id/get-product-by-id.ts";
import { getProductsRoute } from "./routes/get-products/get.products.ts";
import { postImageRoute } from "./routes/post-imgs/post-img.ts";
import { postProductRoute } from "./routes/post-products/post-product.ts";
import { putImageRoute } from "./routes/put-imgs/put-img.ts";
import { putProductRoute } from "./routes/put-product/put-product.ts";

import cors from '@fastify/cors';
import fs from 'node:fs';
import path from 'node:path';
import { getAddresRoute } from "./routes/get-addres/get-addres.ts";
import { getClientRoute } from "./routes/get-user/get-user.ts";
import { getOrdersRoute } from "./routes/get-orders/get-order.ts";
import { postOrdersRoute } from "./routes/post-orders/post-order.ts";
import { putOrderRoute } from "./routes/put-orders/put-orders.ts";

let certPathEnv;
if(process.env.PATH_CERT) certPathEnv = String(process.env.PATH_CERT)

let keyPathEnv 
if(process.env.PATH_KEY) keyPathEnv = String(process.env.PATH_KEY)



   let dataServer:any = {
    }

let httpsOptions ={}
if(  keyPathEnv && certPathEnv ){
    const keyPath = path.join(keyPathEnv);
    const certPath = path.join(certPathEnv);
    
    httpsOptions= {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    }
    dataServer.https = httpsOptions;
}
    
 const server =fastify( dataServer ).withTypeProvider<ZodTypeProvider>()


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
server.register(getAddresRoute);
server.register(getClientRoute);
export { server };
