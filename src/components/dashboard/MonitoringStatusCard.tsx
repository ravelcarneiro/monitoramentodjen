import React from 'react';
import { Eye, Plus } from 'lucide-react';

// Mock data for monitored items
const monitoredItems = [
  {
    id: '1',
    name: 'Empresa ABC Ltda.',
    type: 'cnpj',
    value: '12.345.678/0001-90',
    status: 'active',
    updatedAt: '2023-05-20T10:30:00'
  },
  {
    id: '2',
    name: 'João da Silva',
    type: 'name',
    value: 'João da Silva',
    status: 'active',
    updatedAt: '2023-05-19T14:45:00'
  },
  {
    id: '3',
    name: 'Processo nº 1234567-89.2023.8.26.0100',
    type: 'process',
    value: '1234567-89.2023.8.26.0100',
    status: 'active',
    updatedAt: '2023-05-18T09:15:00'
  }
];

const MonitoringStatusCard: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-primary-600" />
          Monitoramentos
        </h3>
        <button
          type="button"
          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {monitoredItems.map((item) => (
            <li key={item.id} className="px-4 py-3">
              <div className="flex justify-between">
                <div className="truncate">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.type === 'cnpj' && 'CNPJ: '}
                    {item.type === 'process' && 'Processo: '}
                    {item.value}
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ativo
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Atualizado em {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
              </p>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex justify-center">
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Ver todos os monitoramentos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringStatusCard;