import Course from "../models/Courses";
import Division from "../models/Divisions";
import User from "../models/Users";
import Role from "../models/Roles";
import EnrollmentRequest from "../models/EnrollmentRequest.js"; // Asegúrate de tener este modelo para gestionar las solicitudes de inscripción

// Obtener todos los cursos
export const getCourses = async (req, res) => {
    try {
        const cursos = await Course.find()
        .populate('division', 'name')
        .populate('professor', 'name email')
        .populate('students', 'name email');
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cursos', error: error.message });
    }
};

// Obtener todos los cursos en los que un estudiante está inscrito
export const getCoursesForStudent = async (req, res) => {
    const studentId = req.userId; // Asume que el ID del estudiante se obtiene del token
    try {
        // Verificar que el usuario sea un estudiante
        const student = await User.findById(studentId).populate('roles');
        const studentRole = await Role.findOne({ name: "student" });
        const isStudent = student.roles.some(role => role._id.equals(studentRole._id));
        if (!isStudent) {
            return res.status(400).json({ message: "El usuario no tiene rol de estudiante" });
        }

        // Obtener los cursos en los que el estudiante está inscrito
        const courses = await Course.find({ students: studentId })
            .populate('division', 'name')
            .populate('professor', 'name email')
            .populate('students', 'name email');

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cursos', error: error.message });
    }
};

// Crear un curso
export const createCourse = async (req, res) => {
    try {
        const { name, description, divisionName, duration, isActive, professorEmail } = req.body;

        // Verificar que la división exista
        const division = await Division.findOne({ name: divisionName });
        if (!division) {
            return res.status(400).json({ message: "Division no encontrada" });
        }

        // Verificar que el profesor exista y sea un profesor
        const professor = await User.findOne({ email: professorEmail }).populate('roles');
        if (!professor) {
            return res.status(400).json({ message: "Profesor no encontrado" });
        }
        const professorRole = await Role.findOne({ name: "professor" });
        const isProfessor = professor.roles.some(role => role._id.equals(professorRole._id));
        if (!isProfessor) {
            return res.status(400).json({ message: "El usuario no tiene rol de profesor" });
        }

        // Verificar que el profesor pertenezca a la misma división
        if (!professor.division.equals(division._id)) {
            return res.status(400).json({ message: "El profesor no pertenece a la misma division que el curso" });
        }

        // Crear un nuevo curso
        const newCourse = new Course({
            name,
            description,
            division: division._id,
            duration,
            isActive,
            professor: professor._id
        });

        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un curso por su ID
export const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId).populate('division', 'name').populate('professor', 'name email');
        if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el curso', error: error.message });
    }
};

// Actualizar un curso por su ID
export const updateCourseById = async (req, res) => {
    const { courseId } = req.params;
    const { name, description, divisionName, duration, isActive, professorEmail } = req.body;
    try {
        // Verificar que la división exista
        const division = await Division.findOne({ name: divisionName });
        if (!division) {
            return res.status(400).json({ message: "Division no encontrada" });
        }

        // Verificar que el profesor exista y sea un profesor
        const professor = await User.findOne({ email: professorEmail }).populate('roles');
        if (!professor) {
            return res.status(400).json({ message: "Profesor no encontrado" });
        }
        const professorRole = await Role.findOne({ name: "professor" });
        const isProfessor = professor.roles.some(role => role._id.equals(professorRole._id));
        if (!isProfessor) {
            return res.status(400).json({ message: "El usuario no tiene rol de profesor" });
        }

        // Verificar que el profesor pertenezca a la misma división
        if (!professor.division.equals(division._id)) {
            return res.status(400).json({ message: "El profesor no pertenece a la misma division que el curso" });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { name, description, division: division._id, duration, isActive, professor: professor._id },
            { new: true }
        );

        if (!updatedCourse) return res.status(404).json({ message: 'Curso no encontrado' });

        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el curso', error: error.message });
    }
};

// Eliminar un curso por su ID
export const deleteCourseById = async (req, res) => {
    const { courseId } = req.params;
    try {
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) return res.status(404).json({ message: 'Curso no encontrado' });
        res.json({ message: 'Curso eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el curso', error: error.message });
    }
};

// Solicitar inscripción a un curso (Solo Estudiante)
export const requestEnrollment = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.userId; // Asume que el ID del estudiante se obtiene del token
    try {
        // Verificar que el curso exista
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        // Verificar que el usuario sea un estudiante
        const student = await User.findById(studentId).populate('roles');
        const studentRole = await Role.findOne({ name: "student" });
        const isStudent = student.roles.some(role => role._id.equals(studentRole._id));
        if (!isStudent) {
            return res.status(400).json({ message: "El usuario no tiene rol de estudiante" });
        }

        // Crear una nueva solicitud de inscripción
        const newRequest = new EnrollmentRequest({
            course: courseId,
            student: studentId,
            status: 'pending'
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error al solicitar inscripción', error: error.message });
    }
};

// Obtener solicitudes pendientes para un curso (Solo Profesor)
export const getPendingRequests = async (req, res) => {
    const { courseId } = req.params;
    try {
        // Verificar que el curso exista
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        // Verificar que el usuario sea un profesor del curso
        const professorId = req.userId; // Asume que el ID del profesor se obtiene del token
        if (!course.professor.equals(professorId)) {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }

        // Obtener las solicitudes pendientes
        const pendingRequests = await EnrollmentRequest.find({ course: courseId, status: 'pending' })
        .populate('course', 'name')
        .populate('student', 'name email');
        res.json(pendingRequests);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener solicitudes pendientes', error: error.message });
    }
};

// Aprobar o rechazar una solicitud (Solo Profesor)
export const handleEnrollmentRequest = async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;
    try {
        // Verificar que la solicitud exista
        const request = await EnrollmentRequest.findById(requestId).populate('course');
        if (!request) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        // Verificar que el curso exista
        const course = request.course;
        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        // Verificar que el usuario sea un profesor del curso
        const professorId = req.userId;
        if (!course.professor.equals(professorId)) {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }

        // Verificar el estado proporcionado
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        // Actualizar el estado de la solicitud
        request.status = status;
        const updatedRequest = await request.save();

        // Si la solicitud es aprobada, agregar el estudiante al curso
        if (status === 'approved') {
            // Agregar el estudiante al curso si no está ya en la lista
            const courseUpdate = await Course.findByIdAndUpdate(
                course._id,
                { $addToSet: { students: request.student } },
                { new: true }
            );
            if (!courseUpdate) {
                return res.status(500).json({ message: "Error al actualizar el curso" });
            }
            // Respond with the updated course
            res.json({ request: updatedRequest, course: courseUpdate });
        } else {
            // Respond with the updated request if not approved
            res.json(updatedRequest);
        }
    } catch (error) {
        console.error("Error en handleEnrollmentRequest:", error);
        res.status(500).json({ message: 'Error al manejar la solicitud', error: error.message });
    }
};

// Eliminar un estudiante de un curso (Solo Profesor)
export const removeStudentFromCourse = async (req, res) => {
    const { courseId } = req.params;
    const { studentEmail } = req.body;
    try {
        // Verificar que el curso exista
        const course = await Course.findById(courseId).populate('professor', 'email');
        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        // Verificar que el usuario sea un profesor del curso
        const professorId = req.userId;
        if (!course.professor._id.equals(professorId)) {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }

        // Verificar que el estudiante exista
        const student = await User.findOne({ email: studentEmail });
        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        // Verificar que el estudiante esté inscrito en el curso
        const isStudentEnrolled = course.students.some(studentId => studentId.equals(student._id));
        if (!isStudentEnrolled) {
            return res.status(400).json({ message: "El estudiante no está inscrito en el curso" });
        }

        // Eliminar al estudiante del curso
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { students: student._id } },
            { new: true }
        ).populate('students', 'name email');

        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar al estudiante del curso', error: error.message });
    }
};
