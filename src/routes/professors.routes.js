import { Router } from "express";
import * as professorsCtrl from '../controllers/professors.controller';
import { authJwt } from '../middlewares';

const router = Router();

//Establecer ruta estudiantes mediante GET
router.get('/', professorsCtrl.getProfessors);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], professorsCtrl.createProfessor)
router.get('/:professorId', professorsCtrl.getProfessorById);
router.put('/:professorId', [authJwt.verifyToken, authJwt.isAdmin], professorsCtrl.updateProfessorById);
router.delete('/:professorId', [authJwt.verifyToken, authJwt.isAdmin], professorsCtrl.deleteProfessorById);

export default router;