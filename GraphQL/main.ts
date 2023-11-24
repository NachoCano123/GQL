import mongoose from "mongoose"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { GraphQLError } from "graphql"
import { gqlSchema} from "./gqlSchema.ts"
import { modeloPet, PetModelType, Pet } from "./Mongo.ts"
import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts"

const env= await load()

const MONGO_URL = Deno.env.get("MONGO_URL") || env.MONGO_URL || "mongodb+srv://nacho:12345@cluster0.3aayvs9.mongodb.net/Modogql?retryWrites=true&w=majority"
if(!MONGO_URL)
{
  //MONGO_URL: "mongodb+srv://nacho:12345@cluster0.3aayvs9.mongodb.net/Modogql?retryWrites=true&w=majority"
  console.log("no se puede conectar")
  //Deno.exit(1)
}

await mongoose.connect(MONGO_URL)
//Para que esto funcione necesitamos que mongoose y gql reconozcan Pet
//tiene q devolver un modelo que entiendan los dos
const entendermodelo = (tipo :PetModelType):Pet => {
  return {
    id: tipo._id.toString(),
    name: tipo.name,
    breed: tipo.breed
  }
}

const Query = { 
  //Para mostrar todas las mascotas
  pets: async (): Promise<PetModelType[]> => {
      const pets = await modeloPet.find()
      if(!pets){
        throw new GraphQLError("Pet not found")
      }
      return pets
  },

  //Para mostrar una sola mascota
  pet: async (_: unknown, args: { breed: string }): Promise<PetModelType | null> => {
      const pet = await modeloPet.findById(args.breed)
      if (!pet) {
        throw new GraphQLError("Pet breed not found")
      }
      return pet
  },
}

const Mutation = { //Creamos las funciones
  addPet: async (_: unknown, args: { name: string, breed: string }): Promise<Pet> => {
      const { name, breed } = args

      const newPet = new modeloPet({ name, breed })
      await newPet.save()

      //Tengo que convertir newPet en algo que reconozca mongoose y gql
      const modeloentendible = entendermodelo(newPet)
      return modeloentendible
  },
}

const server = new ApolloServer({ //Creamos el servidor Apollo
  typeDefs: gqlSchema,
  resolvers: {
    Query,
    Mutation,
  },
})

const {url} = await startStandaloneServer(server, { //Declaramos el puerto por el que escucha el servidor
  listen: {
    port: 3000,
  },
})

console.info(`Server is listening if you ask at ${url}`)