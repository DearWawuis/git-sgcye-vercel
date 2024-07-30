import { Schema, model } from 'mongoose';

// Definir el esquema del curso
const cursoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    division: {
        type: Schema.Types.ObjectId,
        ref: 'Division',
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    professor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true, // Esto agregará createdAt y updatedAt automáticamente
    versionKey: false
});

// Exportar el modelo
export default model('Course', cursoSchema);
