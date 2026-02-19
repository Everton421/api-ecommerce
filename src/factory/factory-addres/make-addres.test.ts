import test, { after, describe } from "node:test";
import { makerAddres } from "./make-addres.ts";
import assert from "node:assert";
import { pool } from "../../database/client.ts";

describe("make-addres function", async ()=>{
  await  test( " make addres ", async()=>{

            const addresId = await makerAddres();
        assert.strictEqual( typeof addresId, 'number');
            
    })

    after( async ()=>{
        await pool.end();
    })
})