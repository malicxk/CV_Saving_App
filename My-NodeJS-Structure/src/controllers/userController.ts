import { Request, Response } from 'express';
import { CvInteractor } from '../interactors/cvInteractor';

// Define an enum for HTTP status codes
enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

export class CvController {
    private cvInteractor: CvInteractor;

    constructor(cvInteractor: CvInteractor) {
        this.cvInteractor = cvInteractor;
    }

    async saveCv(req: Request, res: Response) {
        try {
            console.log('Saving CV:', req.body);
            const cvId = await this.cvInteractor.saveCv(req.body);
            res.status(HttpStatus.CREATED).json({ message: 'CV saved successfully', cvId });
        } catch (error) {
            console.error('Error saving CV:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to save CV' });
        }
    }

    async getAllCvs(req: Request, res: Response) {
        try {
            const cvs = await this.cvInteractor.getAllCvs();
            res.status(HttpStatus.OK).json(cvs);
        } catch (error) {
            console.error('Error fetching CVs:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch CVs' });
        }
    }

    async getCvById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid CV ID' });
                return;
            }

            const cv = await this.cvInteractor.getCvById(id);
            if (!cv) {
                res.status(404).json({ error: 'CV not found' });
                return;
            }

            res.status(200).json(cv);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch CV' });
        }
    }


    async updateCv(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            console.log("Entered in the controller", id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid CV ID' });
                return;
            }

            const updatedCv = await this.cvInteractor.updateCv(id, req.body);
            if (!updatedCv) {
                res.status(404).json({ error: 'CV not found or update failed' });
                return;
            }

            res.status(200).json(updatedCv); // Send updated data back to client
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ error: 'Error updating CV' });
        }
    }


    async deleteCv(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid CV ID' });
                return;
            }

            const deleted = await this.cvInteractor.deleteCv(id);
            if (!deleted) {
                res.status(404).json({ error: 'CV not found' });
                return;
            }

            res.status(200).json({ message: 'CV deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting CV' });
        }
    }


    async generateCvPdf(req: Request, res: Response): Promise<void> {
        try {
            const cvId = parseInt(req.params.id, 10);
            console.log(`📄 Generating CV PDF for ID: ${cvId}`);

            // ✅ Generate the PDF as a Buffer
            const pdfBuffer = await this.cvInteractor.generateCvPdf(cvId);

            // ✅ Set headers and send PDF as response
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=cv-${cvId}.pdf`,
            });

            res.send(pdfBuffer);
        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            res.status(500).json({ error: 'Failed to generate CV PDF' });
        }
    }
}


