import React from 'react';
import { Calendar, Clock } from 'lucide-react';

// Mock data for deadlines
const deadlines = [
  {
    id: '1',
    processNumber: '1234567-89.2023.8.26.0100',
    title: 'Contestação',
    date: '2023-06-02T23:59:59',
    daysLeft: 5,
    priority: 'high'
  },
  {
    id: '2',
    processNumber: '9876543-21.2023.8.26.0100',
    title: 'Recurso',
    date: '2023-06-05T23:59:59',
    daysLeft: 8,
    priority: 'medium'
  },
  {
    id: '3',
    processNumber: '5432167-89.2023.8.26.0100',
    title: 'Pagamento de Custas',
    date: '2023-06-10T23:59:59',
    daysLeft: 13,
    priority: 'low'
  }
];

const UpcomingDeadlinesCard: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
          Próximos Prazos
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {deadlines.map((deadline) => (
            <li key={deadline.id} className="px-4 py-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Processo: {deadline.processNumber}
                  </p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                    deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {deadline.daysLeft} dias
                  </span>
                </div>
              </div>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(deadline.date).toLocaleDateString('pt-BR')}
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex justify-center">
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Ver todos os prazos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingDeadlinesCard;