import test from "node:test";
import { makeProduct } from "./make-product.ts";
import { faker } from "@faker-js/faker";
import assert from "assert";
import { makeProductImg } from "./make-product-img.ts";

 
  test("[ factory-product ] make product function.", async ( t )=>{
        
        const price  =   Number(faker.commerce.price());
        const offerPrice = price - 1;
        const name =  faker.commerce.product();
        const description =  faker.commerce.productName();
        const category =  faker.commerce.department()
        const specifications=  faker.commerce.productDescription();

        let productId:number = 0 ;
   
        await t.test(" make-product ", async ( t )=>{
              productId = await makeProduct({
                        price,
                        offerPrice,
                        name,
                        description,
                        category,
                        specifications
                    });

        assert.strictEqual(typeof productId , 'number',"Input must by a number. " );
        })

        const arrIdImgs:number[] = [];
        await t.test( 'make-product-img ', async ( t )=>{
            let count = 0;
                    while( count < 3 ){
                        const url = faker.image.url({ height: 480, width: 640 })
                        const idImg = await makeProductImg({imgUrl: url , productId:productId  })
                            arrIdImgs.push(idImg);
                        count++;
            } 
        })
      


  })

