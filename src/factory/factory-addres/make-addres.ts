import { faker } from "@faker-js/faker";
import { type typeAddres } from "../../types/type-addres.ts"
import { makeUser } from "../factory-user/make-user.ts"
import { db } from "../../database/client.ts";
import { addres } from "../../database/schema.ts";


type omitAtributesAddres = Omit<typeAddres, 'updatedAt' | 'createdAt' | 'id'>

type partialBy<T,K extends keyof T> = Omit<T,K> & Partial<Pick<T,K>>;

type insertAddres = partialBy< omitAtributesAddres, 'complement'>
 
export async function makerAddres(userAddres?:insertAddres ){


    const userId =   userAddres?.userId  ?? await makeUser();

    const zipCode = userAddres?.zipCode ?? faker.location.zipCode();
    const road = userAddres?.road ?? faker.location.street();
    const number = userAddres?.number ?? Number(faker.location.buildingNumber())  ;
    const neighborhood = userAddres?.neighborhood ?? faker.location.country();
    const city = userAddres?.city ?? faker.location.city();
    const state = userAddres?.state ?? faker.location.state(); 
    const complement = userAddres?.complement?? faker.location.secondaryAddress();

    const resultInsertID = await db.insert(addres).values({
                 userId ,
                zipCode,
                road,
                number,
                neighborhood,
                city,
                state,
                complement
            }).$returningId();
        
            return resultInsertID[0].id;
}