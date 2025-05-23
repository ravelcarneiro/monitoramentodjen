import axios, { AxiosError } from 'axios';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { z } from 'zod';

// Validation schemas
const PublicationSchema = z.object({
  id: z.string(),
  processNumber: z.string(),
  title: z.string(),
  content: z.string(),
  date: z.string(),
  court: z.string(),
  type: z.enum(['decision', 'order', 'notification', 'other']),
  status: z.enum(['new', 'read']).default('new'),
});

const SearchParamsSchema = z.object({
  query: z.string(),
  searchType: z.enum(['process', 'name', 'document']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  court: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

export type Publication = z.infer<typeof PublicationSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;

export interface SearchResult {
  success: boolean;
  data?: Publication[];
  error?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}

class DJENService {
  private baseUrl: string;
  private token: string | null = null;
  private certificateKey: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_DJEN_API_URL || 'https://api.djen.jus.br';
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('djen_token');
    this.certificateKey = localStorage.getItem('djen_certificate');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.certificateKey) {
      headers['X-Certificate'] = this.certificateKey;
    }

    return headers;
  }

  private handleError(error: unknown): SearchResult {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        localStorage.removeItem('djen_token');
        return {
          success: false,
          error: 'Sessão expirada. Por favor, faça login novamente.',
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao comunicar com o servidor',
      };
    }
    return {
      success: false,
      error: 'Ocorreu um erro inesperado',
    };
  }

  async searchPublications(params: SearchParams): Promise<SearchResult> {
    try {
      // Generate mock publications based on search type and query
      const mockPublications: Publication[] = [];
      const total = Math.floor(Math.random() * 5) + 1; // Generate 1-5 results

      const courts = ['TJSP', 'TRF3', 'STJ', 'STF'];
      const types = ['decision', 'order', 'notification', 'other'] as const;
      const titles = {
        name: ['Intimação', 'Citação', 'Despacho', 'Sentença'],
        process: ['Decisão Interlocutória', 'Despacho', 'Sentença', 'Acórdão'],
        document: ['Notificação', 'Intimação', 'Citação', 'Publicação']
      };

      const contents = {
        name: [
          `Fica ${params.query} intimado(a) para comparecer à audiência designada.`,
          `Vista dos autos a ${params.query}.`,
          `Intime-se ${params.query} para manifestação no prazo legal.`,
          `Cite-se ${params.query} para apresentar contestação.`
        ],
        process: [
          'Vistos. Intime-se a parte autora para manifestação no prazo de 15 dias.',
          'Defiro o pedido de tutela de urgência. Expeça-se mandado.',
          'Designo audiência de conciliação para o dia 15/08/2023.',
          'Homologo o acordo celebrado entre as partes.'
        ],
        document: [
          'Fica a parte intimada para efetuar o pagamento das custas.',
          'Notificação para apresentação de documentos complementares.',
          'Intimação para comparecimento em audiência designada.',
          'Citação para apresentação de defesa no prazo legal.'
        ]
      };

      for (let i = 0; i < total; i++) {
        const court = courts[Math.floor(Math.random() * courts.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const titleList = titles[params.searchType];
        const contentList = contents[params.searchType];
        
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        const content = contentList[Math.floor(Math.random() * contentList.length)];
        
        const processNumber = `${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(10 + Math.random() * 90)}.${2023}.8.26.0100`;
        
        // Generate a random date within the last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        mockPublications.push({
          id: `pub-${Date.now()}-${i}`,
          processNumber,
          title,
          content,
          date: date.toISOString(),
          court,
          type,
          status: Math.random() > 0.5 ? 'new' : 'read'
        });
      }

      // Sort by date, newest first
      mockPublications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        success: true,
        data: mockPublications,
        total,
        page: params.page || 1,
        totalPages: Math.ceil(total / (params.limit || 20))
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exportToPDF(publications: Publication[]): Promise<Blob> {
    const pdf = new jsPDF();
    let yOffset = 20;

    // Add header
    pdf.setFontSize(16);
    pdf.text('Relatório de Publicações', 20, yOffset);
    yOffset += 15;

    // Add date
    pdf.setFontSize(10);
    pdf.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, yOffset);
    yOffset += 15;

    publications.forEach((pub, index) => {
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 20;
      }

      pdf.setFontSize(12);
      pdf.text(`Publicação #${index + 1}`, 20, yOffset);
      yOffset += 8;

      pdf.setFontSize(10);
      pdf.text(`Processo: ${pub.processNumber}`, 20, yOffset);
      yOffset += 6;

      pdf.text(`Data: ${format(new Date(pub.date), 'dd/MM/yyyy')}`, 20, yOffset);
      yOffset += 6;

      pdf.text(`Tipo: ${pub.type}`, 20, yOffset);
      yOffset += 6;

      // Handle long content with word wrap
      const contentLines = pdf.splitTextToSize(pub.content, 170);
      contentLines.forEach((line: string) => {
        if (yOffset > 280) {
          pdf.addPage();
          yOffset = 20;
        }
        pdf.text(line, 20, yOffset);
        yOffset += 6;
      });

      yOffset += 10;
    });

    return pdf.output('blob');
  }

  async exportToCSV(publications: Publication[]): Promise<string> {
    const data = publications.map(pub => ({
      'Número do Processo': pub.processNumber,
      'Data': format(new Date(pub.date), 'dd/MM/yyyy'),
      'Tipo': pub.type,
      'Tribunal': pub.court,
      'Título': pub.title,
      'Conteúdo': pub.content,
    }));

    return Papa.unparse(data, {
      delimiter: ',',
      header: true,
    });
  }

  async markAsRead(publicationId: string): Promise<boolean> {
    try {
      await axios.patch(
        `${this.baseUrl}/publications/${publicationId}`,
        { status: 'read' },
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Failed to mark publication as read:', error);
      return false;
    }
  }
}

export const djenService = new DJENService();