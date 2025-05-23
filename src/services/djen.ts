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

  async authenticate(certificate: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/auth`,
        { certificate },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.token) {
        this.token = response.data.token;
        this.certificateKey = certificate;
        localStorage.setItem('djen_token', this.token);
        localStorage.setItem('djen_certificate', certificate);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  async searchPublications(params: SearchParams): Promise<SearchResult> {
    try {
      // Validate search parameters
      const validatedParams = SearchParamsSchema.parse(params);

      // Format dates for the API
      const queryParams = new URLSearchParams({
        q: validatedParams.query,
        type: validatedParams.searchType,
        page: validatedParams.page.toString(),
        limit: validatedParams.limit.toString(),
      });

      if (validatedParams.startDate) {
        queryParams.append('startDate', format(validatedParams.startDate, 'yyyy-MM-dd'));
      }

      if (validatedParams.endDate) {
        queryParams.append('endDate', format(validatedParams.endDate, 'yyyy-MM-dd'));
      }

      if (validatedParams.court) {
        queryParams.append('court', validatedParams.court);
      }

      const response = await axios.get(`${this.baseUrl}/publications/search?${queryParams}`, {
        headers: this.getHeaders(),
      });

      // Validate response data
      const publications = z.array(PublicationSchema).parse(response.data.publications);

      return {
        success: true,
        data: publications,
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
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

  async scheduleSearch(params: SearchParams, frequency: 'daily' | 'weekly' | 'realtime'): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/schedules`,
        {
          searchParams: params,
          frequency,
        },
        { headers: this.getHeaders() }
      );

      return response.data.success;
    } catch (error) {
      console.error('Failed to schedule search:', error);
      return false;
    }
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