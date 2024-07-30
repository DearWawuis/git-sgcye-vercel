import express from 'express';
import studentsRoutes from './src/routes/students.routes';
import professorsRoutes from './src/routes/professors.routes';
import coursesRoutes from './src/routes/courses.routes';
import divisionsRoutes from './src/routes/divisions.routes';
import authRoutes from './src/routes/auth.routes';
import { createDivisions, createRoles } from './src/libs/initialSetup';

const app = express();

//Ejecutar función para crear roles
createRoles();
createDivisions();

//Establecer la ruta inicial
app.get('/', (req, res) => {
    res.send('Bienvenido a mi API');
});

app.use(express.json());
app.use('/students', studentsRoutes);
app.use('/professors', professorsRoutes);
app.use('/courses', coursesRoutes);
app.use('/divisions', divisionsRoutes);
app.use('/api/auth', authRoutes);
export default app;