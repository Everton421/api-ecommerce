import test from "node:test";
import { makeProduct } from "./make-product.ts";
import { faker } from "@faker-js/faker";
import assert from "assert";
import { makeProductImg } from "./make-product-img.ts";

 
  test.it("[ factory-product ] make product function.", async ()=>{
        
        const price  =   Number(faker.commerce.price());
        const offerPrice = price - 1;
        const name =  faker.commerce.product();
        const description =  faker.commerce.productName();
        const category =  faker.commerce.department()
        const specifications=  faker.commerce.productDescription();

   const productId = await makeProduct({
            price,
            offerPrice,
            name,
            description,
            category,
            specifications
        });

        assert.strictEqual(typeof productId , 'number',"Input must by a number. " );
        
        const arrIdImgs:number[] = [];

        let count = 0;
        while( count < 3 ){
            const url = faker.image.url({ height: 480, width: 640 })
            const idImg = await makeProductImg({imgUrl: url , productId:productId  })
                arrIdImgs.push(idImg);
            count++;
        } 


  })

