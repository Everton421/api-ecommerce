 import { faker } from '@faker-js/faker'
import { db } from '../../database/client.ts'
import { products_imgs } from '../../database/schema.ts'

    

    export async function seedProduct(){
            await db.insert(products_imgs).values(
                {
                    productId:1,
                    imgUrl:faker.image.urlLoremFlickr({ category: 'nature'}),
                     typeImg:'catalog',

                }
            )
    }
