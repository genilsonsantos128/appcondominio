import React from 'react';
import { Bell, FileText, MessageSquare, CreditCard, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export function ResidentDashboard() {
  const { notices, bills } = useData();
  const { user } = useAuth();

  const userBills = bills.filter(bill => bill.apartment === user?.apartment);
  const pendingBills = userBills.filter(bill => bill.status === 'pending');
  const recentNotices = notices.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-gray-600">Apartamento {user?.apartment}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Hoje</p>
          <p className="text-lg font-semibold text-gray-800">
            {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avisos Ativos</p>
              <p className="text-2xl font-bold text-gray-800">{notices.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Boletos Pendentes</p>
              <p className="text-2xl font-bold text-gray-800">{pendingBills.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Próximo Vencimento</p>
              <p className="text-sm font-bold text-gray-800">
                {pendingBills.length > 0 
                  ? new Date(pendingBills[0].dueDate).toLocaleDateString('pt-BR')
                  : 'Nenhum'
                }
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Área do Morador</p>
              <p className="text-sm font-bold text-blue-600">Acesso Completo</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Avisos Recentes</h2>
            <FileText className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentNotices.map((notice) => (
            <div key={notice.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-800">{notice.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notice.priority === 'high' ? 'bg-red-100 text-red-800' :
                      notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {notice.priority === 'high' ? 'Alta' :
                       notice.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{notice.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notice.date).toLocaleDateString('pt-BR')} • {notice.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Bills */}
      {pendingBills.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Boletos Pendentes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingBills.map((bill) => (
              <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Taxa Condominial - {bill.month}/{bill.year}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Vencimento: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">
                      R$ {bill.amount.toFixed(2)}
                    </p>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      Baixar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}