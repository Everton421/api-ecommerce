import test, { after } from "node:test";
import { server } from "../../app.ts";
import   request   from 'supertest';
import assert from "node:assert";
import { faker } from "@faker-js/faker";
import { makeProduct } from "../../factory/factory-product/make-product.ts";
import { pool } from "../../database/client.ts";
 
 test("[ PUT PRODUCT ROUTE] .", async ( t )=>{

    await   server.ready();
            const id = await makeProduct()

         const price  =   Number(faker.commerce.price());
        const  offerPrice = price - 1;
        const  name =  faker.commerce.product();
        const  description =  faker.commerce.productName();
        const  category =  faker.commerce.department()
        const  specifications=  faker.commerce.productDescription();

        const response = await request(server.server)
        .put(`/product/${id}`)
        .send({
               name,
               description,
               price,
               offerPrice,
               category,
               specifications 
        })

             const status = response.status 
             assert.strictEqual(Number(status) , 200 , 'ok.' )
     
             after( async()=>{
                    await pool.end();
               })

 })