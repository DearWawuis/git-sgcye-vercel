import { Router } from "express";
import * as divisionsCtrl from '../controllers/divisions.controller';
import { authJwt } from '../middlewares';

const router = Router();

//Establecer ruta divisiones mediante GET
router.get('/', divisionsCtrl.getDivisions);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], divisionsCtrl.createDivision);
router.get('/:DivisionId', divisionsCtrl.getDivisionById);
router.put('/:DivisionId', [authJwt.verifyToken, authJwt.isAdmin], divisionsCtrl.updateDivisionById);
router.delete('/:DivisionId', [authJwt.verifyToken, authJwt.isAdmin], divisionsCtrl.deleteDivisionById);

export default router;