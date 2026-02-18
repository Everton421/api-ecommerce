import { faker } from "@faker-js/faker";
import test, { after } from "node:test";
import request from 'supertest';
import { server } from "../../app.ts";
import { makeProduct } from "../../factory/factory-product/make-product.ts";
import { makeProductImg } from "../../factory/factory-product/make-product-img.ts";
import assert from "node:assert";
import { pool } from "../../database/client.ts";

test(" [ PUT-IMG ROUTE ]", async () => {
    await server.ready();

    const countImg = 3;

    const productId = await makeProduct();

    const imgsId: {id:number }[] = [];

    for (let i = 0; i < countImg; i++) {
        let imgId = await makeProductImg({
            imgUrl: faker.image.url(),
            productId: productId,
            typeImg: 'catalog'
        });
        imgsId.push({ id: imgId});
    }

    const resquestArrayImgs = [];
    for (const i of imgsId) {
        resquestArrayImgs.push({
            id: i.id,
            imgUrl: faker.image.url(),
            productId: productId,
            typeImg: 'catalog'
        });

    }
        if(resquestArrayImgs.length === 0 ){

        }
 
    const response = await request(server.server)
        .put(`/product/${productId}/img`)
        .send({imgs:resquestArrayImgs})

            const responseImg = response.body;
        assert.deepStrictEqual(typeof responseImg , 'object')

        after( async ()=>{
            await pool.end();
        })
    })