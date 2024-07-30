import { Router } from "express";
import * as courseController from '../controllers/courses.controller';
import { verifyToken, isStudent, isProfessor, isAdminOrProfessor } from '../middlewares/authJwt';

const router = Router();

//Establecer ruta cursos mediante GET
router.get('/', courseController.getCourses);
router.get('/my-courses', [verifyToken, isStudent], courseController.getCoursesForStudent);
router.post('/', [verifyToken, isAdminOrProfessor], courseController.createCourse);
router.get('/:courseId', courseController.getCourseById);
router.put('/:courseId', [verifyToken, isAdminOrProfessor], courseController.updateCourseById);
router.delete('/:courseId', [verifyToken, isAdminOrProfessor], courseController.deleteCourseById);
router.post('/:courseId/request', [verifyToken, isStudent], courseController.requestEnrollment);
router.get('/:courseId/pending', [verifyToken, isProfessor], courseController.getPendingRequests);
router.put('/request/:requestId', [verifyToken, isProfessor], courseController.handleEnrollmentRequest);
router.put('/remove-student/:courseId', [verifyToken, isProfessor], courseController.removeStudentFromCourse);

export default router;