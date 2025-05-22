import React, { useState } from 'react';
import { BarChart2, Download, Calendar, ArrowRight, Filter, FileText } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportType, setReportType] = useState('publications');
  const [court, setCourt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState<Array<{
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
    status: 'ready' | 'generating';
  }>>([
    {
      id: '1',
      name: 'Relatório de Publicações - Maio 2023',
      type: 'publications',
      date: '2023-05-15T10:30:00',
      size: '1.2 MB',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Análise de Processos - Abril 2023',
      type: 'analysis',
      date: '2023-04-10T14:45:00',
      size: '2.5 MB',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Estatísticas de Monitoramento - Q1 2023',
      type: 'monitoring',
      date: '2023-03-31T09:15:00',
      size: '3.7 MB',
      status: 'ready'
    }
  ]);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    setGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const newReport = {
        id: `report-${Date.now()}`,
        name: `Relatório de ${
          reportType === 'publications' ? 'Publicações' :
          reportType === 'monitoring' ? 'Monitoramento' : 'Análise de Processos'
        } - ${new Date().toLocaleDateString('pt-BR')}`,
        type: reportType,
        date: new Date().toISOString(),
        size: `${(Math.random() * 5).toFixed(1)} MB`,
        status: 'ready' as const
      };
      
      setReports(prev => [newReport, ...prev]);
      setGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary-600" />
            Gerar Novo Relatório
          </h3>
          <div className="mt-5">
            <form onSubmit={handleGenerateReport}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="report-type" className="block text-sm font-medium text-gray-700">
                    Tipo de Relatório
                  </label>
                  <select
                    id="report-type"
                    name="report-type"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="publications">Publicações</option>
                    <option value="monitoring">Monitoramento</option>
                    <option value="analysis">Análise de Processos</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="court" className="block text-sm font-medium text-gray-700">
                    Tribunal
                  </label>
                  <select
                    id="court"
                    name="court"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="TJSP">TJSP</option>
                    <option value="TRF3">TRF3</option>
                    <option value="STJ">STJ</option>
                    <option value="STF">STF</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                    Data Inicial
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="date"
                      name="start-date"
                      id="start-date"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                    Data Final
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="date"
                      name="end-date"
                      id="end-date"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={generating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Gerando relatório...
                    </>
                  ) : (
                    <>
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Gerar Relatório
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary-600" />
            Relatórios Gerados
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li key={report.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BarChart2 className="h-6 w-6 text-primary-600" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-primary-600">{report.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Gerado em {new Date(report.date).toLocaleDateString('pt-BR')} às {new Date(report.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {report.size}
                        </span>
                        {report.status === 'ready' ? (
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-yellow-800 border-t-transparent mr-1" />
                            Gerando...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;