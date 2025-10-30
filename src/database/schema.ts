import { serial, text, varchar } from "drizzle-orm/mysql-core";
import { datetime } from "drizzle-orm/mysql-core";
import { mysqlEnum } from "drizzle-orm/mysql-core";
import { decimal } from "drizzle-orm/mysql-core";
import { int } from "drizzle-orm/mysql-core";
import { mysqlTable } from "drizzle-orm/mysql-core";



 
  export const typeUser = mysqlEnum( [ "admin", "client"]);
  export const typeImg = mysqlEnum( [ "catalog","specification" ]);
  export const statusOrder = mysqlEnum([ "cancelled","delivered", "shipped", "processing" ,"pending"])
  export const statusPayment = mysqlEnum(['pending','authorized'])
  //pending "Pendente
  //processing "Processando
  //shipped "Enviado
  //delivered "Entregue
  //cancelled "Cancelado

  export const products = mysqlTable('products',{
    id:  int().primaryKey().autoincrement(),
    name: varchar( { length: 255}) ,
    description:varchar( { length: 255}),
    price: decimal( { precision:10, scale:2}).notNull().default('0.00'),
    offerPrice: decimal( { precision:10, scale:2}).notNull().default('0.00'),
    category: varchar( { length:255}).notNull(),
    specifications: text(),
    createdAt: datetime().notNull().default(new Date('2001-01-01 00:00:00')),
    updatedAt: datetime().notNull().default(new Date('2001-01-01 00:00:00')) 
})

export const products_imgs = mysqlTable('products_imgs',{
    id: int().primaryKey().autoincrement(),
    productId: int().notNull().references( ()=> products.id),
    typeImg:typeImg.notNull().default('catalog'),
    imgUrl:varchar({ length: 255 }).notNull(),
    createdAt: datetime().notNull().default(new Date('2001-01-01 00:00:00')),
    updatedAt: datetime().notNull().default(new Date('2001-01-01 00:00:00')) 
})  



export const users = mysqlTable('users',{
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length:255}).notNull(),
    imageUrl: varchar( { length: 255 }),
    phoneNumber: varchar( { length: 255 }).notNull(),
    type:  typeUser.notNull().default('client'),
    createdAt: datetime().notNull().default(new Date('2001-01-01 00:00:00')),
    updatedAt: datetime().notNull().default(new Date('2001-01-01 00:00:00'))
  })

export const addres = mysqlTable('addres', { 
    id: int().primaryKey().autoincrement(),
    userId: int().notNull().references( ()=> users.id ),
    phoneNumber: varchar( { length: 255 }).notNull(),
    zipCode: varchar({ length:255} ).notNull(),
    road:varchar({ length:255} ).notNull(),
    number: int().notNull(),
    neighborhood:varchar({ length:255} ).notNull(),
    city: varchar({ length: 255}).notNull(),
    state: varchar({ length:255}).notNull(),
   createdAt: datetime().notNull().default(new Date('2001-01-01 00:00:00')),
    updatedAt: datetime().notNull().default(new Date('2001-01-01 00:00:00'))
})

export const orders = mysqlTable('orders',{
    id: int().primaryKey().autoincrement(),
    userId: int().notNull().references(()=> users.id),
    total: decimal({ precision:10, scale:2 }).notNull().default('0.00'), 
    status:  statusOrder.notNull().default('pending'),
    addres: int().notNull().references( ()=> addres.id),
    shipping: decimal({ precision:10, scale:2}).notNull().default('0.00'),
    payment: statusPayment.notNull().default('pending'),
    tracking_id:varchar({length: 255}).notNull(),
    createdAt: datetime().notNull().default(new Date('2001-01-01 00:00:00')),
    updatedAt: datetime().notNull().default(new Date('2001-01-01 00:00:00')) 
})

export const items= mysqlTable('items',{
    orderId: int().notNull().references( ()=> orders.id ),
    productId: int().notNull().references( ()=> products.id),
    quantity: int().notNull(),
    price: decimal( { precision:10, scale:2}).notNull().default('0.00'),
    offerPrice: decimal( { precision:10, scale:2}).notNull().default('0.00'), 
})

 