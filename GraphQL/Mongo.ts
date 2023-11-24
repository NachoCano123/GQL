import mongoose, {Schema} from "mongoose"

const petMongoSchema = new Schema({ //Creamos un esquema de mongo
    name: {type: String, required: true},
    breed: {type: String,required: true},
})

export type Pet = { //Representamos la estructura del objeto Pet
    id: string
    name: string
    breed: string
}

//Para que mongo identifique el tipo Pet
export type PetModelType = mongoose.Document & Pet //Es un tipo que nos da un modelo mongoose con un Pet, y lo que tenemos que hacer es sacar de este PetModelType el Pet
export const modeloPet = mongoose.model<PetModelType>("Pet", petMongoSchema) //Es el objeto Pet, cuyo tipo es PetModelType