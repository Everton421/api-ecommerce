import test, { after } from "node:test";
import { makeUser } from "../../factory/factory-user/make-user.ts";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";
import assert from "node:assert";
import { server } from "../../app.ts";
import request from 'supertest';
import { pool } from "../../database/client.ts";

test(" [ GET USER ROUTE ] ", async (t) => {

    const name = " TEST " + randomUUID();
    await t.test("", async () => {

        const resultInsertUser = await makeUser({
            email: faker.internet.email(),
            imageUrl: faker.image.url(),
            name: name,
            phoneNumber: faker.phone.number(),
            type: 'client'
        })
        assert.strictEqual(typeof resultInsertUser, 'number', 'input must by a number ')
    })

    await server.ready();

    const response = await request(server.server).get('/user')
        .query({
            search: name
        })


        after(async ()=>{
            await pool.end();
        })

})