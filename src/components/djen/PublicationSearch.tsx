import React, { useState } from 'react';
import { Search, Download, Calendar } from 'lucide-react';
import { djenService, Publication, SearchParams } from '../../services/djen';
import toast from 'react-hot-toast';

interface PublicationSearchProps {
  onResultsFound: (publications: Publication[]) => void;
}

const PublicationSearch: React.FC<PublicationSearchProps> = ({ onResultsFound }) => {
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    searchType: 'process',
    startDate: undefined,
    endDate: undefined,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await djenService.searchPublications(searchParams);
      
      if (result.success && result.data) {
        onResultsFound(result.data);
        toast.success('Publicações encontradas com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao buscar publicações');
      }
    } catch (error) {
      toast.error('Erro ao realizar a busca');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv', publications: Publication[]) => {
    try {
      if (format === 'pdf') {
        const blob = await djenService.exportToPDF(publications);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'publications.pdf';
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const csv = await djenService.exportToCSV(publications);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'publications.csv';
        link.click();
        URL.revokeObjectURL(url);
      }
      toast.success(`Exportação para ${format.toUpperCase()} concluída`);
    } catch (error) {
      toast.error(`Erro ao exportar para ${format.toUpperCase()}`);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="searchType" className="block text-sm font-medium text-gray-700">
              Tipo de Busca
            </label>
            <select
              id="searchType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={searchParams.searchType}
              onChange={(e) => setSearchParams(prev => ({ ...prev, searchType: e.target.value as SearchParams['searchType'] }))}
            >
              <option value="process">Número do Processo</option>
              <option value="name">Nome</option>
              <option value="document">CPF/CNPJ</option>
            </select>
          </div>

          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700">
              Termo de Busca
            </label>
            <input
              type="text"
              id="query"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder={
                searchParams.searchType === 'process' ? '0000000-00.0000.0.00.0000' :
                searchParams.searchType === 'name' ? 'Nome completo' :
                'CPF ou CNPJ'
              }
              value={searchParams.query}
              onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="startDate"
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value ? new Date(e.target.value) : undefined }))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Data Final
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="endDate"
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                onChange={(e) => setSearchParams(prev => ({ ...prev, endDate: e.target.value ? new Date(e.target.value) : undefined }))}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicationSearch;