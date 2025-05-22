import axios from 'axios';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

export interface Publication {
  id: string;
  processNumber: string;
  title: string;
  content: string;
  date: string;
  court: string;
  type: 'decision' | 'order' | 'notification' | 'other';
}

export interface SearchParams {
  query: string;
  searchType: 'process' | 'name' | 'document';
  startDate?: Date;
  endDate?: Date;
}

export interface SearchResult {
  success: boolean;
  data?: Publication[];
  error?: string;
}

class DJENService {
  private baseUrl = 'https://djen.pje.jus.br/api';
  private token: string | null = null;

  constructor() {
    // Initialize authentication if needed
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('djen_token');
  }

  private getHeaders() {
    return {
      'Authorization': this.token ? `Bearer ${this.token}` : '',
      'Content-Type': 'application/json',
    };
  }

  async authenticate(certificate: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth`, { certificate }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.token) {
        this.token = response.data.token;
        localStorage.setItem('djen_token', this.token);
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
      // Format dates for the API
      const formattedStartDate = params.startDate ? format(params.startDate, 'yyyy-MM-dd') : undefined;
      const formattedEndDate = params.endDate ? format(params.endDate, 'yyyy-MM-dd') : undefined;

      const response = await axios.get(`${this.baseUrl}/publications/search`, {
        headers: this.getHeaders(),
        params: {
          q: params.query,
          type: params.searchType,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });

      return {
        success: true,
        data: response.data.publications,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch publications',
      };
    }
  }

  async exportToPDF(publications: Publication[]): Promise<Blob> {
    const pdf = new jsPDF();
    let yOffset = 10;

    publications.forEach((pub, index) => {
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 10;
      }

      pdf.setFontSize(12);
      pdf.text(`Publication #${index + 1}`, 10, yOffset);
      yOffset += 10;

      pdf.setFontSize(10);
      pdf.text(`Process: ${pub.processNumber}`, 10, yOffset);
      yOffset += 7;

      pdf.text(`Date: ${new Date(pub.date).toLocaleDateString()}`, 10, yOffset);
      yOffset += 7;

      pdf.text(`Type: ${pub.type}`, 10, yOffset);
      yOffset += 7;

      pdf.text(`Content: ${pub.content}`, 10, yOffset);
      yOffset += 15;
    });

    return pdf.output('blob');
  }

  async exportToCSV(publications: Publication[]): Promise<string> {
    const csv = Papa.unparse(publications.map(pub => ({
      Process: pub.processNumber,
      Date: new Date(pub.date).toLocaleDateString(),
      Type: pub.type,
      Content: pub.content,
    })));

    return csv;
  }

  async scheduleSearch(params: SearchParams, frequency: 'daily' | 'weekly'): Promise<boolean> {
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
}

export const djenService = new DJENService();