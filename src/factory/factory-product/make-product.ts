import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { products } from "../../database/schema.ts";
import { type typeProduct, type typeProductImg } from "../../types/type-product.ts";

    type insertProduct = Omit<typeProduct, 'updatedAt' | 'createdAt' | 'id'> 


export async function makeProduct(product?: insertProduct, imgs?:typeProductImg[] ){

        const price  = product?.price ??  Number(faker.commerce.price());
        const offerPrice = product?.offerPrice ?? price - 1;
        const name = product?.name ?? faker.commerce.product();
        const description = product?.description ?? faker.commerce.productName();
        const category = product?.category ?? faker.commerce.department()
        const specifications= product?.specifications ?? faker.commerce.productDescription();

        const resultInsert  = await db.insert(products).values(
                {
                name: name,
                description: description,
                price: String(price) ,
                offerPrice: String(offerPrice),
                category: category,
                specifications: specifications ,
                }
            ).$returningId();

           return resultInsert[0].id;
 
}