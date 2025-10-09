


  type productImg =  {
    id:number
    name:string | null 
    description:string | null 
    price:string
    offerPrice:string
    category:string
    createdAt:   Date
    updatedAt:   Date
    imgs:imgsProduct[]  
} 
   type product  =  {
    id:number
    name:string | null 
    description:string | null 
    price:string
    offerPrice:string
    category:string
    createdAt:   Date
    updatedAt:    Date
} 
  type imgsProduct = {id:number, productId:number, imgUrl:string  }




export function transformProduct(product: product , imgs?:imgsProduct[])   {
                                    return {
                                      category: product.category,
                                      createdAt: product.createdAt,
                                      description: product.description,
                                      id: product.id,
                                      imgs: imgs ? imgs : [],
                                      name: product.name,
                                      offerPrice: product.offerPrice,
                                      price: product.price,
                                      updatedAt: product.updatedAt
                                            }
}