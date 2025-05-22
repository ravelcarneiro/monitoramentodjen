import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Publication } from '../../services/djen';

interface PublicationListProps {
  publications: Publication[];
  onExport: (format: 'pdf' | 'csv') => void;
}

const PublicationList: React.FC<PublicationListProps> = ({ publications, onExport }) => {
  return (
    <div className="space-y-4">
      {publications.length > 0 && (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onExport('pdf')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={() => onExport('csv')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </button>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {publications.map((publication) => (
            <li key={publication.id}>
              <div className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-primary-600">{publication.title}</p>
                        <p className="text-sm text-gray-500">
                          Processo: {publication.processNumber}
                        </p>
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
                      <p className="text-sm text-gray-500">{publication.content}</p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {new Date(publication.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {publications.length === 0 && (
            <li className="px-4 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma publicação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Faça uma busca para encontrar publicações.
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PublicationList;