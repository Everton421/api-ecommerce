import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { type typeUser } from "../../types/type-user.ts";


type typeInsertUser =  Omit<typeUser, 'createdAt' | 'updatedAt' | 'id'>;


export async function makeUser (user?:typeInsertUser) {

        const email = user?.email ?? faker.internet.email();
        const name = user?.name ?? faker.person.fullName();
        const phoneNumber = user?.phoneNumber ?? faker.phone.number();
        const imageUrl = user?.imageUrl ?? faker.image.avatar();
        const type = user?.type ?? 'client';
            const resultInserUser = await db.insert(users).values(
                {
                    email,
                    name,
                    phoneNumber,
                    imageUrl,
                    type
                }
            ).$returningId()
      
    return resultInserUser[0].id
}