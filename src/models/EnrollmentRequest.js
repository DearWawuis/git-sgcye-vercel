import { Schema, model } from 'mongoose';

// Definición del esquema para las solicitudes de inscripción
const EnrollmentRequestSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('EnrollmentRequest', EnrollmentRequestSchema);
