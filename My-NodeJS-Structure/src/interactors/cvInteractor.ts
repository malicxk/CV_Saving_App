import { ICvInteractor } from '../providers/interfaces/ICvInteractor';
import { ICvRepository } from '../providers/interfaces/ICvRepository';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export class CvInteractor implements ICvInteractor {
  constructor(private cvRepository: ICvRepository) { }

  async saveCv(data: {
    name: string;
    email: string;
    phone: string;
    professionalSummary: string;
    skills: string;
    workExperience: string;
    education: string;
  }): Promise<number> {
    // Directly pass the entire data object to the repository method
    return await this.cvRepository.createUser(data);
  }

  async getAllCvs(): Promise<any[]> {
    return await this.cvRepository.getAllUsers();
  }

  async getCvById(id: number): Promise<any | null> {
    return await this.cvRepository.getUserById(id);
  }

  async updateCv(id: number, data: any): Promise<any> {
    try {
      const updatedCv = await this.cvRepository.updateCv(id, data);
      if (!updatedCv) {
        throw new Error('CV not found or update failed');
      }
      return updatedCv; // Return success message and id if successful
    } catch (error) {
      console.error('Error in Interactor:', error);
      throw new Error('Error updating CV');
    }
  }

  async deleteCv(id: number): Promise<boolean> {
    return await this.cvRepository.deleteCv(id);
  }

  async generateCvPdf(cvId: number): Promise<Buffer> {
    console.log(`🔍 Fetching CV with ID: ${cvId}`);

    const cv = await this.cvRepository.getUserById(cvId);
    if (!cv) {
      console.error('❌ CV not found!');
      throw new Error('CV not found');
    }
    console.log('✅ CV data:', cv);
    const parsedEducation = JSON.parse(cv.education);
    console.log('Parsed Education:', parsedEducation);

    const printer = new PdfPrinter({
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique', // ✅ Fix: Define an italics font
        bolditalics: 'Helvetica-BoldOblique' // ✅ Optional: Define bold-italics font
      }
    });

    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: cv.name || 'No Name Provided', style: 'header' },
        { text: `Email: ${cv.email || 'No Email'}`, style: 'subheader' },
        { text: `Phone: ${cv.phone || 'No Phone'}`, style: 'subheader' },
        { text: 'Professional Summary', style: 'section' },
        { text: cv.professionalSummary || 'No Summary Provided', style: 'body' },

        { text: 'Skills', style: 'section' },
        { ul: (cv.skills ? cv.skills.split(',').map((skill: string) => skill.trim()) : ['No Skills Provided']), style: 'body' },

        { text: 'Work Experience', style: 'section' },
        ...(Array.isArray(cv.workExperience) && cv.workExperience.length > 0
          ? cv.workExperience.map((exp: any) => ({
            text: `${exp.position} at ${exp.company} (${exp.duration})`, style: 'body'
          }))
          : [{ text: cv.workExperience || 'No Work Experience', italics: true, style: 'body' }]),

        { text: 'Education', style: 'section' },
        ...(Array.isArray(parsedEducation) && parsedEducation.length > 0
          ? parsedEducation.map((edu: any) => ({
            text: `${edu.degree} from ${edu.school} (${edu.year})`, style: 'body'
          }))
          : [{ text: 'No Education Details', italics: true, style: 'body' }])
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 5],
          color: '#2C3E50' // Dark gray
        },
        subheader: {
          fontSize: 14,
          bold: true,
          alignment: 'left',
          margin: [0, 5, 0, 5],
          color: '#34495E' // Medium gray
        },
        section: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 10],
          color: '#1ABC9C' // Teal for section headings
        },
        body: {
          fontSize: 12,
          alignment: 'left',
          margin: [0, 5, 0, 5],
          color: '#7F8C8D' // Light gray for body text
        }
      }
    };

    console.log('✅ Document definition:', docDefinition);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // Create a buffer to store the PDF in memory
    const chunks: Uint8Array[] = [];
    return new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', (err: Error) => reject(err));
      pdfDoc.end();
    });
  }


}


