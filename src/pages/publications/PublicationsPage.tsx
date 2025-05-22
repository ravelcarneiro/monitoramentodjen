import React, { useState } from 'react';
import { FileText, Filter, Search, Calendar, Download } from 'lucide-react';

// Mock data for publications
const mockPublications = Array(20).fill(null).map((_, index) => ({
  id: `pub-${index + 1}`,
  processNumber: `${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(10 + Math.random() * 90)}.${2023}.8.26.0100`,
  title: ['Despacho', 'Sentença', 'Decisão Interlocutória', 'Intimação', 'Publicação de Edital'][Math.floor(Math.random() * 5)],
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  court: ['TJSP', 'TRF3', 'STJ', 'STF'][Math.floor(Math.random() * 4)],
  date: new Date(2023, 4, Math.floor(1 + Math.random() * 28)).toISOString(),
  status: Math.random() > 0.2 ? 'read' : 'new'
}));

// Sort by date, newest first
mockPublications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const PublicationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [publications, setPublications] = useState(mockPublications);
  const [filters, setFilters] = useState({
    court: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter publications by search query
    if (searchQuery) {
      const filtered = mockPublications.filter(pub => 
        pub.processNumber.includes(searchQuery) || 
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPublications(filtered);
    } else {
      setPublications(mockPublications);
    }
  };

  const applyFilters = () => {
    let filtered = [...mockPublications];
    
    if (filters.court) {
      filtered = filtered.filter(pub => pub.court === filters.court);
    }
    
    if (filters.status) {
      filtered = filtered.filter(pub => pub.status === filters.status);
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(pub => new Date(pub.date) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(pub => new Date(pub.date) <= toDate);
    }
    
    setPublications(filtered);
  };

  const resetFilters = () => {
    setFilters({
      court: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
    setPublications(mockPublications);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Publicações</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <form onSubmit={handleSearch}>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-l-md sm:text-sm border-gray-300"
                      placeholder="Número do processo, título ou conteúdo"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>Pesquisar</span>
                  </button>
                </div>
              </form>
            </div>
            <div className="flex space-x-2">
              <div className="w-full">
                <select
                  id="court"
                  name="court"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={filters.court}
                  onChange={handleFilterChange}
                >
                  <option value="">Tribunal</option>
                  <option value="TJSP">TJSP</option>
                  <option value="TRF3">TRF3</option>
                  <option value="STJ">STJ</option>
                  <option value="STF">STF</option>
                </select>
              </div>
              <div className="w-full">
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Status</option>
                  <option value="new">Não lido</option>
                  <option value="read">Lido</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={applyFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Limpar
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-4">
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                Data Inicial
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="date"
                  name="dateFrom"
                  id="dateFrom"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                Data Final
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="date"
                  name="dateTo"
                  id="dateTo"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {publications.length > 0 ? (
            publications.map((publication) => (
              <li key={publication.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          publication.status === 'new' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <FileText className={`h-5 w-5 ${
                            publication.status === 'new' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">
                              {publication.title}
                            </p>
                            {publication.status === 'new' && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Novo
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex">
                            <p className="text-xs text-gray-500">
                              Processo: {publication.processNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {publication.court}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {publication.content}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(publication.date).toLocaleDateString('pt-BR')} às {new Date(publication.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma publicação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar seus filtros ou pesquisa para encontrar o que está procurando.
              </p>
            </li>
          )}
        </ul>
        
        {publications.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a{' '}
                  <span className="font-medium">{publications.length}</span> de{' '}
                  <span className="font-medium">{publications.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    1
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Próximo</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationsPage;