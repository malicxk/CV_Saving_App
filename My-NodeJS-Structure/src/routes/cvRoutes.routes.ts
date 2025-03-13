import { Router } from 'express';
import { CvController } from '../controllers/userController';
import { CvInteractor } from '../interactors/cvInteractor';
import { CvRepository } from '../repositories/cvRepository';

const cvRoutes = Router();

// Initialize dependencies
const cvRepository = new CvRepository();
const cvInteractor = new CvInteractor(cvRepository);
const cvController = new CvController(cvInteractor);

cvRoutes.post('/save', async (req, res) => await cvController.saveCv(req, res));
cvRoutes.get('/all', async (req, res) => await cvController.getAllCvs(req, res));
cvRoutes.get('/:id', cvController.getCvById.bind(cvController));
cvRoutes.put('/:id', cvController.updateCv.bind(cvController));
cvRoutes.delete('/:id', cvController.deleteCv.bind(cvController));
cvRoutes.get('/:id/generate-pdf', (req, res) => cvController.generateCvPdf(req, res));





export default cvRoutes;

