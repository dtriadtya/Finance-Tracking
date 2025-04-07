import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletCards, Receipt, FileSpreadsheet, LogOut, Menu, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';

const Navbar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { collapsed, toggleSidebar } = useSidebar();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/',
      name: 'Dashboard',
      icon: WalletCards
    },
    {
      path: '/transactions',
      name: 'Transaksi',
      icon: Receipt
    },
    {
      path: '/reports',
      name: 'Laporan',
      icon: FileSpreadsheet
    }
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-600 via-blue-500 to-blue-700 shadow-lg flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-12 bg-blue-500 text-white rounded-full p-1 shadow-md hover:bg-blue-600 z-10"
      >
        {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <div className={`p-6 border-b border-blue-400 border-opacity-30 ${collapsed ? 'justify-center' : ''} flex`}>
        <Link to="/" className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <WalletCards className="h-8 w-8 text-white" />
          {!collapsed && <span className="font-bold text-xl text-white">FinanceTracker</span>}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
                }`}
                title={collapsed ? item.name : ''}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      {user && (
        <div className={`p-4 border-t border-blue-400 border-opacity-30 ${collapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => signOut()}
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 w-full rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors`}
            title={collapsed ? 'Sign Out' : ''}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;