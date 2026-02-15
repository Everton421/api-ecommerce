import test from "node:test";
import { server } from "../../app.ts";
import   request   from 'supertest';
import assert from "node:assert";
import { faker } from "@faker-js/faker";
 
 test.it(" post-product route.", async ()=>{

    await   server.ready();

         const price  =   Number(faker.commerce.price());
        const offerPrice = price - 1;
        const name =  faker.commerce.product();
        const description =  faker.commerce.productName();
        const category =  faker.commerce.department()
        const specifications=  faker.commerce.productDescription();

        const response = await request(server.server)
        .post('/product')
        .send({
               name,
               description,
               price,
               offerPrice,
               category,
               specifications 
        })

             const producId = response.body.id
             assert.strictEqual(typeof producId, 'number', 'input must by a number.' )

 })