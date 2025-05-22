import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Search, Bell, FileText, Users, Settings, BarChart2, 
  X, Eye, FileSearch, Briefcase
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isDesktop?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = false, 
  onClose = () => {}, 
  isDesktop = false 
}) => {
  const { user } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Publicações', href: '/publications', icon: FileSearch },
    { name: 'Monitoramento', href: '/monitoring', icon: Eye },
    { name: 'Relatórios', href: '/reports', icon: BarChart2 },
    { name: 'Perfil', href: '/profile', icon: Settings },
  ];

  const renderSidebarContent = () => (
    <>
      <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-primary-700">
        <Briefcase className="h-8 w-8 text-white" />
        <span className="ml-2 text-xl font-bold text-white">JusMonitor</span>
      </div>
      <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-600">
              <span className="text-lg font-medium text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                Ver perfil
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (isDesktop) {
    return renderSidebarContent();
  }

  return (
    <div
      className={`fixed inset-0 flex z-40 md:hidden transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
        {renderSidebarContent()}
      </div>
      <div className="flex-shrink-0 w-14" aria-hidden="true">
        {/* Dummy element to force sidebar to shrink to fit close icon */}
      </div>
    </div>
  );
};

export default Sidebar;