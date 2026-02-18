import { faker } from "@faker-js/faker";
import assert from "node:assert";
import test, { after } from "node:test";
import request from 'supertest';
import { server } from "../../app.ts";
import { pool } from "../../database/client.ts";
import { makeProduct } from "../../factory/factory-product/make-product.ts";

test(" [ POST-IMG ROUTE ]", async () => {
    await server.ready();

    const countImg = 3;

    const productId = await makeProduct();
    const resquestArrayImgs = [];

    for (let i = 0; i < countImg; i++) {
        resquestArrayImgs.push({
            imgUrl: faker.image.url(),
            productId: productId,
            typeImg: 'catalog'
        });
    }

    const response = await request(server.server)
        .post(`/product/${productId}/img`)
        .send({ imgs: resquestArrayImgs })

    const responseImg = response.body;

    assert.deepStrictEqual(typeof responseImg, 'object')

    after(async () => {
        await pool.end();
    })
})