import test, { after } from "node:test";
import { makeUser } from "./make-user.ts";
import assert from "node:assert";
import { pool } from "../../database/client.ts";


test("[ TEST Factory-user ] ", async (t) => {

      let id = 0;
      await t.test(" Teste makeUser function ", async (t) => {
            id = await makeUser();
      })
      assert.strictEqual(typeof id, 'number', " input must by a number.")

      after(async () => {
            await pool.end();
      })
})