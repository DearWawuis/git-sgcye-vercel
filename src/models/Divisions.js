import { Schema, model } from "mongoose";

const divisionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

export default model('Division', divisionSchema)