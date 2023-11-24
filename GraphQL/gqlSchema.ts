//Creamos un esquema de graphql
export const gqlSchema = `#graphql   #Este comentario (#graphql) es para que el codigo salga con colores, ya que si lo quitamos sale todo del mismo color, ya que todo esto es un string

#await PetModel.findbyid(id) devuleve variable petmodeltype, q no es lo mismo a pet

type Pet { #La estructura del tipo Pet del esquema gql. //Para que gql identifique el tipo Pet
    id: ID!
    name: String!
    breed: String!
}

type Query{ #Para declarar las funciones que muestran
  pets: [Pet!]!
  pet(id: ID!): [Pet!]
}

type Mutation{ #Para declarar las funciones
  addPet( name: String!, breed: String!): Pet!
  #deletePet: (id: ID!): Pet!
}

`  //Todo lo que hay entre las comillas es un string. En graphql los comentarios se hacen con #