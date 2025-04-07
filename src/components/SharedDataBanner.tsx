import React from 'react';
import { Info } from 'lucide-react';

const SharedDataBanner: React.FC = () => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            Semua pengguna yang login dapat melihat dan mengelola data yang sama. 
            Data transaksi dibagikan antar semua pengguna.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedDataBanner;