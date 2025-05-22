import React, { useState } from 'react';
import { Eye, Plus, X, Clock, Calendar, Bell, MoreHorizontal, Search, FileText } from 'lucide-react';

// Mock data for monitored items
const initialMonitoredItems = Array(10).fill(null).map((_, index) => {
  const types = ['name', 'cnpj', 'process'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  let name, value;
  if (type === 'name') {
    const names = ['João da Silva', 'Maria Oliveira', 'Carlos Santos', 'Ana Pereira', 'Roberto Lima'];
    name = names[Math.floor(Math.random() * names.length)];
    value = name;
  } else if (type === 'cnpj') {
    const companies = ['Empresa ABC Ltda.', 'Comercial XYZ S/A', 'Indústria 123 Ltda.', 'Serviços Gerais Ltda.'];
    name = companies[Math.floor(Math.random() * companies.length)];
    value = `${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}/${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
  } else {
    name = `Processo #${Math.floor(1000 + Math.random() * 9000)}`;
    value = `${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(10 + Math.random() * 90)}.${2023}.8.26.0100`;
  }
  
  return {
    id: `mon-${index + 1}`,
    name,
    type,
    value,
    status: Math.random() > 0.2 ? 'active' : 'paused',
    createdAt: new Date(2023, Math.floor(Math.random() * 5), Math.floor(1 + Math.random() * 28)).toISOString(),
    updatedAt: new Date(2023, 4, Math.floor(1 + Math.random() * 28)).toISOString(),
    notificationType: Math.random() > 0.5 ? 'email' : 'both',
    frequency: ['daily', 'weekly', 'realtime'][Math.floor(Math.random() * 3)],
    totalPublications: Math.floor(Math.random() * 50)
  };
});

const MonitoringPage: React.FC = () => {
  const [monitoredItems, setMonitoredItems] = useState(initialMonitoredItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMonitoring, setNewMonitoring] = useState({
    name: '',
    type: 'name',
    value: '',
    notificationType: 'email',
    frequency: 'daily'
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter monitored items by search query
    if (searchQuery) {
      const filtered = initialMonitoredItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.value.includes(searchQuery)
      );
      setMonitoredItems(filtered);
    } else {
      setMonitoredItems(initialMonitoredItems);
    }
  };
  
  const handleStatusChange = (id: string, status: 'active' | 'paused') => {
    setMonitoredItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };
  
  const handleDelete = (id: string) => {
    setMonitoredItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddMonitoring = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new monitoring
    const newItem = {
      id: `mon-${Date.now()}`,
      name: newMonitoring.name,
      type: newMonitoring.type,
      value: newMonitoring.value,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notificationType: newMonitoring.notificationType,
      frequency: newMonitoring.frequency,
      totalPublications: 0
    };
    
    setMonitoredItems(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewMonitoring({
      name: '',
      type: 'name',
      value: '',
      notificationType: 'email',
      frequency: 'daily'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Monitoramento</h1>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Monitoramento
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSearch}>
            <div className="mt-1 flex rounded-md shadow-sm">
              <div className="relative flex items-stretch flex-grow focus-within:z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-l-md pl-10 sm:text-sm border-gray-300"
                  placeholder="Buscar por nome, CNPJ ou número do processo"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <span>Pesquisar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {monitoredItems.length > 0 ? (
            monitoredItems.map((item) => (
              <li key={item.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          item.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Eye className={`h-5 w-5 ${
                            item.status === 'active' ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">
                              {item.name}
                            </p>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status === 'active' ? 'Ativo' : 'Pausado'}
                            </span>
                          </div>
                          <div className="mt-1 flex">
                            <p className="text-xs text-gray-500">
                              {item.type === 'cnpj' && 'CNPJ: '}
                              {item.type === 'process' && 'Processo: '}
                              {item.value}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(item.id, 'paused')}
                            className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <span className="sr-only">Pausar</span>
                            <Clock className="h-5 w-5" aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(item.id, 'active')}
                            className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <span className="sr-only">Ativar</span>
                            <Eye className="h-5 w-5" aria-hidden="true" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <span className="sr-only">Excluir</span>
                          <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <span className="sr-only">Mais opções</span>
                          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Bell className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            {item.notificationType === 'email' ? 'Email' : 'Email & SMS'}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            {item.frequency === 'daily' ? 'Diário' : 
                             item.frequency === 'weekly' ? 'Semanal' : 
                             'Tempo real'}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                          <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            {item.totalPublications} publicações
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>
                          Criado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-12 text-center">
              <Eye className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum monitoramento encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece adicionando um novo monitoramento.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Novo Monitoramento
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Add Monitoring Modal */}
      {isAddModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Eye className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Novo Monitoramento</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Preencha os dados para criar um novo monitoramento.
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleAddMonitoring} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome do monitoramento
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={newMonitoring.name}
                    onChange={(e) => setNewMonitoring(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Tipo de monitoramento
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={newMonitoring.type}
                    onChange={(e) => setNewMonitoring(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="name">Nome</option>
                    <option value="cnpj">CNPJ</option>
                    <option value="process">Número do Processo</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                    {newMonitoring.type === 'name' ? 'Nome completo' :
                     newMonitoring.type === 'cnpj' ? 'CNPJ' :
                     'Número do processo'}
                  </label>
                  <input
                    type="text"
                    name="value"
                    id="value"
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={newMonitoring.value}
                    onChange={(e) => setNewMonitoring(prev => ({ ...prev, value: e.target.value }))}
                    placeholder={
                      newMonitoring.type === 'name' ? 'Ex: João da Silva' :
                      newMonitoring.type === 'cnpj' ? 'Ex: 12.345.678/0001-90' :
                      'Ex: 1234567-89.2023.8.26.0100'
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="notificationType" className="block text-sm font-medium text-gray-700">
                    Tipo de notificação
                  </label>
                  <select
                    id="notificationType"
                    name="notificationType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={newMonitoring.notificationType}
                    onChange={(e) => setNewMonitoring(prev => ({ ...prev, notificationType: e.target.value }))}
                  >
                    <option value="email">Apenas Email</option>
                    <option value="both">Email e SMS</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                    Frequência de verificação
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={newMonitoring.frequency}
                    onChange={(e) => setNewMonitoring(prev => ({ ...prev, frequency: e.target.value }))}
                  >
                    <option value="realtime">Tempo real</option>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                  </select>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Criar monitoramento
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringPage;