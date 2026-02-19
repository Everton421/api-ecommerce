import test, { after, describe } from "node:test";
import { server } from "../../app.ts";
import request from 'supertest';
import assert from "node:assert";
import { pool } from "../../database/client.ts";
import { faker } from "@faker-js/faker";

describe("[ POST-USER ROUTE ] ", async  ()=>{

    await server.ready()
    

        const email = faker.internet.email();
        const name = faker.person.firstName();
        const phoneNumber = faker.phone.number();

            
    const zipCode =   faker.location.zipCode();
    const road =   faker.location.street();
    const number =   Number(faker.location.buildingNumber())  ;
    const neighborhood =   faker.location.country();
    const city =   faker.location.city();
    const state =   faker.location.state(); 
    const complement =   faker.location.secondaryAddress();
 
      test(" Create user sucessfully", async  ()=>{

        const response = await request(server.server)
        .post('/user')
        .send(
            {
                "email": email,
                "name": name,
                "phoneNumber": phoneNumber,
                "imageUrl": "",
                "type": "client",
                    "addres": {
                        "zipCode": zipCode,
                        "road": road,
                        "number":number,
                        "neighborhood": neighborhood,
                        "complement": complement,
                        "city": city,
                        "state": state
                    }
            }
        )

        assert.strictEqual( response.status, 201 , "Error in create user route.")
    })


    test("Error creating user ", async ()=>{

        const response = await request(server.server)
        .post('/user')
        .send(
            {
                "email": email,
                "name": name,
                "phoneNumber": 123,
                "imageUrl": "",
                "type": "client",
                    "addres": {
                        "zipCode": zipCode,
                        "road": road,
                        "number":number,
                        "neighborhood": neighborhood,
                        "complement": complement,
                        "city": city,
                        "state": state
                    }
            }
        )

        assert.strictEqual( response.status, 400 , "--- --- ")
    })

     after( async ()=>{
        await pool.end();
     })
})