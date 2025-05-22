import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

// Mock data for publications
const mockPublications = [
  {
    id: '1',
    processNumber: '1234567-89.2023.8.26.0100',
    title: 'Despacho Judicial',
    content: 'Vistos. Diante da certidão de fls. 123, intime-se a parte autora para manifestação no prazo de 15 dias.',
    court: 'TJSP',
    date: '2023-05-20T10:30:00',
    status: 'new'
  },
  {
    id: '2',
    processNumber: '9876543-21.2023.8.26.0100',
    title: 'Decisão Interlocutória',
    content: 'Defiro o pedido de tutela de urgência. Expeça-se mandado de citação e intimação.',
    court: 'TJSP',
    date: '2023-05-19T14:45:00',
    status: 'read'
  },
  {
    id: '3',
    processNumber: '5432167-89.2023.8.26.0100',
    title: 'Sentença',
    content: 'Ante o exposto, JULGO PROCEDENTE o pedido inicial para condenar a ré ao pagamento de R$ 10.000,00.',
    court: 'TJSP',
    date: '2023-05-18T09:15:00',
    status: 'read'
  },
  {
    id: '4',
    processNumber: '7654321-98.2023.8.26.0100',
    title: 'Intimação',
    content: 'Fica a parte autora intimada para comparecer à audiência designada para o dia 10/06/2023 às 14h.',
    court: 'TJSP',
    date: '2023-05-17T16:20:00',
    status: 'read'
  },
  {
    id: '5',
    processNumber: '2345678-90.2023.8.26.0100',
    title: 'Publicação de Edital',
    content: 'Edital de citação. Prazo 20 dias. Processo nº 2345678-90.2023.8.26.0100.',
    court: 'TJSP',
    date: '2023-05-16T11:10:00',
    status: 'read'
  }
];

const RecentPublicationsList: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {mockPublications.map((publication) => (
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
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {publication.content}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {new Date(publication.date).toLocaleDateString('pt-BR')} às {new Date(publication.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <button
                      type="button"
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentPublicationsList;