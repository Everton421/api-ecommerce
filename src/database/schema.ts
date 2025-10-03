import { serial, varchar } from "drizzle-orm/mysql-core";
import { datetime } from "drizzle-orm/mysql-core";
import { mysqlEnum } from "drizzle-orm/mysql-core";
import { decimal } from "drizzle-orm/mysql-core";
import { int } from "drizzle-orm/mysql-core";
import { mysqlTable } from "drizzle-orm/mysql-core";



export const statusOrder = mysqlEnum( ["canceled","em-andamento","erro","pendente"])
 
  

export const products = mysqlTable('products',{
    id:  int().primaryKey(),
    name: varchar( { length: 255}).notNull(),
    description:varchar( { length: 255}),
    price: decimal( { precision:10, scale:2}).notNull().default('0.00'),
    offerPrice: decimal( { precision:10, scale:2}).notNull().default('0.00'),
    category: varchar( { length:255}).notNull(),
    createdAt: datetime().notNull(),
    updatedAt: datetime().notNull()
})

export const users = mysqlTable('users',{
    id: int().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length:255}).notNull(),
    imageUrl: varchar( { length: 255 }).notNull(),
    phoneNumber: varchar( { length: 255 }).notNull(),
      createdAt: datetime().notNull(),
     updatedAt: datetime().notNull()
})

export const addres = mysqlTable('addres', { 
    id: int().primaryKey(),
    userId: int().notNull().references( ()=> users.id ),
    phoneNumber: varchar( { length: 255 }).notNull(),
    zipCode: varchar({ length:255} ).notNull(),
     road:varchar({ length:255} ).notNull(),
     number: int().notNull(),
     neighborhood:varchar({ length:255} ).notNull(),
     city: varchar({ length: 255}).notNull(),
     state: varchar({ length:255}).notNull(),
     createdAt: datetime().notNull(),
     updatedAt: datetime().notNull()
})

export const orders = mysqlTable('orders',{
    id: int().primaryKey(),
    userId: int().notNull().references(()=> users.id),
    total: decimal({ precision:10, scale:2 }).notNull().default('0.00'), 
    status:  mysqlEnum( ["canceled","served","erro","open"]),
    addres: int().notNull().references( ()=> addres.id), 
    payment: mysqlEnum(['pending','authorized']),
     createdAt: datetime().notNull(),
     updatedAt: datetime().notNull()
})

export const items= mysqlTable('items',{
    orderId: int().notNull().references( ()=> orders.id ),
    productId: int().notNull().references( ()=> products.id),
    quantity: int().notNull(),
      price: decimal( { precision:10, scale:2}).notNull().default('0.00'),
    offerPrice: decimal( { precision:10, scale:2}).notNull().default('0.00'), 
})

/** 
  
export const addressDummyData = [
  {
    "_id": "67a1e4233f34a77b6dde9055",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "fullName": "GreatStack",
    
    "phoneNumber": "0123456789",
    
    "zipCode": 654321,
    "road":
    "number":
    "neighborhood":
    "area": "Main Road , 123 Street, G Block",
    "city": "City",
    "state": "State",
    "__v": 0
  }
]

{
    CartItems: {
        user: * id usuario
        produto: * id do produto 
        // especificações: quantidade, preco, etc 
    }
}

 */