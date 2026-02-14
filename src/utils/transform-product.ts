


  type productImg =  {
    id:number
    name:string | null 
    description:string | null 
    price:string
    offerPrice:string
    category:string
    createdAt:   Date
    updatedAt:   Date
    specifications: string | null ,
    imgs:imgsProduct[]  
} 
   type product  =  {
    id:number
    name:string | null 
    description:string | null 
    price:string
    offerPrice:string
    category:string
    specifications: string | null ,
    createdAt:   Date
    updatedAt:    Date
} 
  type imgsProduct = {id:number, productId:number, imgUrl:string , typeImg: 'catalog' | 'specification' }




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
                                       specifications: product.specifications,
                                      updatedAt: product.updatedAt
                                            }
}