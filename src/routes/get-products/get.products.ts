import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../../database/client.ts"
import { products } from "../../database/schema.ts"
import z from "zod"
import { and, like, or, SQL } from "drizzle-orm"

export const getPtroductsRoute:FastifyPluginAsyncZod   = async ( server ) =>{
    server.get('/products',{
        schema:{
            tags:['products'],
            querystring: z.object({
                search: z.string().optional(),
                updatedAt: z.date().optional()
            }),
            response:{

            }
        }
    }
, async (request, reply )=>{

        const {  search } = request.query

            const conditions:SQL[] =[];


        if(search   ){
            const searchTerm = `%${search}%`
            const searchConditions = or(
                like(products.name, searchTerm),
                like(products.description, searchTerm),
                like(products.category, searchTerm),
            )
            
            if(searchConditions ){
                conditions.push(searchConditions);
            }

             
        }
        const result = await db.select()
        .from(products)
        .where( conditions.length > 0 ? and(...conditions) : undefined)

    }
)
}
/**
 
  const { orderBy, ativo, acesso,   search, groupBy, host, efetuar_backup } = request.query
        
        const conditions:SQL[] =[]; 
       
        if (search) {
            const searchTerm = `%${search}%`;
            const searchConditions = or(
                like(clientes.nomeFantasia, searchTerm),
                like(clientes.razaoSocial, searchTerm),
                like(clientes.cnpj, searchTerm),
                like(clientes.ip, searchTerm),
                like(clientes.host, searchTerm)
            );

            if (searchConditions) {
                conditions.push(searchConditions);
            }
        }

        if (host) {
            conditions.push(eq(clientes.host, host));
        }
        if( ativo){
            conditions.push(eq(clientes.ativo, ativo));
        }

        if(acesso){
            conditions.push(eq(clientes.acesso, acesso));
        }
        if (efetuar_backup) {
            conditions.push(eq(clientes.efetuar_backup, efetuar_backup));
        }

      
            
      const clients = await 
        db.select()
         .from(clientes)
         .where( conditions.length > 0 ? and(...conditions) : undefined )  // Use 'and' and handle empty conditions
         .groupBy( clientes[groupBy] )
         .orderBy( asc( clientes[orderBy]))
        

 */