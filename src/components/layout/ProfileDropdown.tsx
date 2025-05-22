import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircle, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface ProfileDropdownProps {
  user: any;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
  const { logout } = useAuth();

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <span className="sr-only">Abrir menu de usuário</span>
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile"
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'flex px-4 py-2 text-sm text-gray-700'
                )}
              >
                <UserCircle className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                Seu Perfil
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile/settings"
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'flex px-4 py-2 text-sm text-gray-700'
                )}
              >
                <Settings className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                Configurações
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logout}
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'flex w-full px-4 py-2 text-sm text-gray-700'
                )}
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                Sair
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileDropdown;