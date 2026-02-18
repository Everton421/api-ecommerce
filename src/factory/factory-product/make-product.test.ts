import test, { after } from "node:test";
import { makeProduct } from "./make-product.ts";
import { faker } from "@faker-js/faker";
import assert from "assert";
import { makeProductImg } from "./make-product-img.ts";
import { db, pool } from "../../database/client.ts";


test("[ Teste factory-product ] make product function.", { timeout: 5000 }, async (t) => {

    const price = Number(faker.commerce.price());
    const offerPrice = price - 1;
    const name = faker.commerce.product();
    const description = faker.commerce.productName();
    const category = faker.commerce.department()
    const specifications = faker.commerce.productDescription();

    let productId: number = 0;

    await t.test(" Teste make-product ", async (t) => {
        productId = await makeProduct({
            price,
            offerPrice,
            name,
            description,
            category,
            specifications
        });


        assert.strictEqual(typeof productId, 'number', "Input must by a number. ");

    })
    const arrIdImgs: number[] = [];
    await t.test(" Teste make-product-img ", async (t) => {

        if (!productId) throw new Error("undefined productId  ")

        let imgCount = 3;
        for (let i = 0; i < imgCount; i++) {
            const url = faker.image.url({ height: 480, width: 640 })
            const idImg = await makeProductImg({ imgUrl: url, productId: productId })
            arrIdImgs.push(idImg);
        }
        assert.strictEqual(arrIdImgs.length, imgCount, "input array is empty.")
    })

    after(async () => {
        await pool.end();
    })

})

