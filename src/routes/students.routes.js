import { Router } from "express";
import * as studentsCtrl from '../controllers/students.controller';
import { authJwt } from '../middlewares';

const router = Router();

//Establecer ruta estudiantes mediante GET
router.get('/', studentsCtrl.getStudents);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], studentsCtrl.createStudent)
router.get('/:studentId', studentsCtrl.getStudentById);
router.put('/:studentId', [authJwt.verifyToken, authJwt.isAdmin], studentsCtrl.updateStudentById);
router.delete('/:studentId', [authJwt.verifyToken, authJwt.isAdmin], studentsCtrl.deleteStudentById);

export default router;