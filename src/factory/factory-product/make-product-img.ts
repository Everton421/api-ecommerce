import { db } from "../../database/client.ts";
import { products_imgs } from "../../database/schema.ts";
import { type typeProductImg } from "../../types/type-product.ts";

type omitIDataImg = Omit<typeProductImg, 'updatedAt' | 'createdAt' | 'id'>;

type partialBy<T,K extends keyof T> = Omit<T,K> & Partial<Pick<T,K>>;

type insertImg = partialBy<omitIDataImg, 'typeImg'> 

export async function makeProductImg( img:insertImg  ){

        const imgUrl = img.imgUrl;
        const productId =img.productId;
       
        const resultInsert  = await db.insert(products_imgs).values(
                {
                      imgUrl,
                      productId,
                       
                }
            ).$returningId();
            
            return resultInsert[0].id;

}