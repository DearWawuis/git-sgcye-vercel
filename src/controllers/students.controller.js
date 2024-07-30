import User from "../models/Users";
import Division from "../models/Divisions";
import Role from "../models/Roles";

// Obtener todos los estudiantes
export const getStudents = async (req, res) => {
    try {
        const studentRole = await Role.findOne({ name: "student" });
        const students = await User.find({ roles: { $in: [studentRole._id] } })
        .populate('division', 'name')
        .populate('roles', 'name');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los estudiantes', error: error.message });
    }
}

// Obtener un estudiante por su ID
export const getStudentById = async (req, res) => {
    const { studentId } = req.params;
    try {
        const studentRole = await Role.findOne({ name: "student" });
        const student = await User.findById(studentId)
            .populate('division', 'name')
            .populate('roles', 'name');
        
        if (!student || !student.roles.some(role => role._id.equals(studentRole._id))) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el estudiante', error: error.message });
    }
};

// Crear un estudiante
export const createStudent = async (req, res) => {
    try {
        const { name, lname, email, password, division, age } = req.body;

        // Buscar la división correspondiente
        const foundDivision = await Division.findOne({ name: division });
        if (!foundDivision) {
            return res.status(404).json({ message: 'División no encontrada' });
        }

        // Buscar el rol de estudiante
        const studentRole = await Role.findOne({ name: "student" });

        // Crear un nuevo estudiante
        const newStudent = new User({
            name,
            lname,
            email,
            password: await User.encryptPassword(password),
            division: foundDivision._id,
            age,
            roles: [studentRole._id]
        });

        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el estudiante', error: error.message });
    }
};

// Actualizar un estudiante por su ID
export const updateStudentById = async (req, res) => {
    const { studentId } = req.params;
    const { name, lname, division, age } = req.body;
    try {
        // Buscar la división correspondiente
        const foundDivision = await Division.findOne({ name: division });
        if (!foundDivision) {
            return res.status(404).json({ message: 'División no encontrada' });
        }

        // Buscar el rol de estudiante
        const studentRole = await Role.findOne({ name: "student" });

        // Actualizar el estudiante con los nuevos datos y división
        const updatedStudent = await User.findByIdAndUpdate(
            studentId,
            { name, lname, division: foundDivision._id, age },
            { new: true }
        );

        if (!updatedStudent || !updatedStudent.roles.includes(studentRole._id)) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el estudiante', error: error.message });
    }
};

// Eliminar un estudiante por su ID
export const deleteStudentById = async (req, res) => {
    const { studentId } = req.params;
    try {
        const studentRole = await Role.findOne({ name: "student" });
        const student = await User.findById(studentId);
        if (!student || !student.roles.some(role => role._id.equals(studentRole._id))) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        
        await User.findByIdAndDelete(studentId);
        res.json({ message: 'Estudiante eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el estudiante', error: error.message });
    }
};
