import React from 'react';
import { Calendar, Eye, FilePlus, FileText, Search, Bell, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import StatCard from '../../components/dashboard/StatCard';
import RecentPublicationsList from '../../components/dashboard/RecentPublicationsList';
import MonitoringStatusCard from '../../components/dashboard/MonitoringStatusCard';
import UpcomingDeadlinesCard from '../../components/dashboard/UpcomingDeadlinesCard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  React.useEffect(() => {
    // Simulate receiving a notification when the dashboard loads
    setTimeout(() => {
      addNotification({
        title: 'Nova publicação',
        message: 'Há uma nova publicação disponível para o processo 1234567-89.2023.8.26.0100',
        type: 'publication'
      });
    }, 3000);
  }, [addNotification]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Bem-vindo de volta, {user?.name || 'Usuário'}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Publicações Hoje"
          value="12"
          icon={FilePlus}
          iconColor="text-blue-500"
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Monitoramentos Ativos"
          value="24"
          icon={Eye}
          iconColor="text-green-500"
          bgColor="bg-green-50"
        />
        <StatCard 
          title="Alertas Pendentes"
          value="3"
          icon={Bell}
          iconColor="text-red-500"
          bgColor="bg-red-50"
        />
        <StatCard 
          title="Prazos Próximos"
          value="5"
          icon={Clock}
          iconColor="text-amber-500"
          bgColor="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary-600" />
                Publicações Recentes
              </h3>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Ver todas
              </button>
            </div>
            <RecentPublicationsList />
          </div>
        </div>

        <div className="space-y-5">
          <MonitoringStatusCard />
          <UpcomingDeadlinesCard />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Search className="h-5 w-5 mr-2 text-primary-600" />
            Pesquisa Rápida
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="mt-1 flex rounded-md shadow-sm">
            <div className="relative flex items-stretch flex-grow focus-within:z-10">
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-l-md sm:text-sm border-gray-300"
                placeholder="Número do processo, nome da parte ou assunto"
              />
            </div>
            <button
              type="button"
              className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span>Pesquisar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;