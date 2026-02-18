export type typeProduct = {  
    id:number
    name:string
    description:string
    price:number
    offerPrice:number
    category:string
    specifications:string
    createdAt:string
    updatedAt:string
}

export type typeProductImg = {
id:string
productId:number
typeImg:  "catalog" | "specification" 
imgUrl: string
createdAt:string
updatedAt:string
}

