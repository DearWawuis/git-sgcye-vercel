import User from "../models/Users";
import Division from "../models/Divisions";
import Role from "../models/Roles";

// Obtener todos los profesores
export const getProfessors = async (req, res) => {
    try {
        const professorRole = await Role.findOne({ name: "professor" });
        const profesores = await User.find({ roles: { $in: [professorRole._id] } })
        .populate('division', 'name')
        .populate('roles', 'name');
        res.json(profesores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los profesores', error: error.message });
    }
}

// Obtener un profesor por su ID
export const getProfessorById = async (req, res) => {
    const { professorId } = req.params;
    try {
        const professorRole = await Role.findOne({ name: "professor" });
        const professor = await User.findById(professorId)
            .populate('division', 'name')
            .populate('roles', 'name');
        
        if (!professor || !professor.roles.some(role => role._id.equals(professorRole._id))) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }

        res.json(professor);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el profesor', error: error.message });
    }
};

// Crear un profesor
export const createProfessor = async (req, res) => {
    try {
        const { name, lname, email, password, division, age } = req.body;

        // Buscar la división correspondiente
        const foundDivision = await Division.findOne({ name: division });
        if (!foundDivision) {
            return res.status(404).json({ message: 'División no encontrada' });
        }

        // Buscar el rol de profesor
        const professorRole = await Role.findOne({ name: "professor" });

        // Crear un nuevo profesor
        const newProfessor = new User({
            name,
            lname,
            email,
            password: await User.encryptPassword(password),
            division: foundDivision._id,
            age,
            roles: [professorRole._id]
        });

        const savedProfessor = await newProfessor.save();
        res.status(201).json(savedProfessor);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear al profesor', error: error.message });
    }
};

// Actualizar un profesor por su ID
export const updateProfessorById = async (req, res) => {
    const { professorId } = req.params;
    const { name, lname, division, age } = req.body;
    try {
        // Buscar la división correspondiente
        const foundDivision = await Division.findOne({ name: division });
        if (!foundDivision) {
            return res.status(404).json({ message: 'División no encontrada' });
        }

        // Buscar el rol de estudiante
        const professorRole = await Role.findOne({ name: "professor" });

        // Actualizar el estudiante con los nuevos datos y división
        const updatedProfessor = await User.findByIdAndUpdate(
            professorId,
            { name, lname, division: foundDivision._id, age },
            { new: true }
        );

        if (!updatedProfessor || !updatedProfessor.roles.includes(professorRole._id)) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        
        res.json(updatedProfessor);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el profesor', error: error.message });
    }
};

// Eliminar un profesor por su ID
export const deleteProfessorById = async (req, res) => {
    const { professorId } = req.params;
    try {
        const professorRole = await Role.findOne({ name: "professor" });
        const professor = await User.findById(professorId);
        if (!professor || !professor.roles.some(role => role._id.equals(professorRole._id))) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        
        await User.findByIdAndDelete(professorId);
        res.json({ message: 'Profesor eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el profesor', error: error.message });
    }
};