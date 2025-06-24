import React from 'react';
import { Users, FileText, MessageSquare, CreditCard, TrendingUp, AlertCircle, DollarSign, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function AdminDashboard() {
  const { notices, complaints, bills } = useData();

  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const totalBills = bills.length;
  const pendingBills = bills.filter(b => b.status === 'pending').length;
  const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);
  const totalApartments = [...new Set(bills.map(b => b.apartment))].length;

  const recentComplaints = complaints.slice(0, 3);
  const recentBills = bills.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">Visão geral do condomínio</p>
        </div>
        <div className="text-right bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Hoje</p>
          <p className="text-lg font-bold text-blue-800">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avisos Publicados</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{notices.length}</p>
              <p className="text-xs text-green-600 mt-1">↗ Ativos</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Reclamações Pendentes</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{pendingComplaints}</p>
              <p className="text-xs text-red-600 mt-1">Requer atenção</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Boletos Pendentes</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{pendingBills}</p>
              <p className="text-xs text-yellow-600 mt-1">Aguardando pagamento</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Receita Arrecadada</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">R$ {totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1">↗ Este mês</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Reclamações Recentes</h2>
              <MessageSquare className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-800 text-sm">{complaint.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {complaint.status === 'pending' ? 'Pendente' :
                         complaint.status === 'in-progress' ? 'Em Andamento' : 'Resolvido'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">{complaint.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(complaint.date).toLocaleDateString('pt-BR')} • {complaint.category}
                    </p>
                  </div>
                  {complaint.status === 'pending' && (
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bills */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Boletos Recentes</h2>
              <CreditCard className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBills.map((bill) => (
              <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-800 text-sm">
                        Apt. {bill.apartment} - {bill.month}/{bill.year}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                        bill.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status === 'paid' ? 'Pago' :
                         bill.status === 'overdue' ? 'Vencido' : 'Pendente'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(bill.dueDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>R$ {bill.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">Publicar Aviso</h3>
            <p className="text-sm text-blue-700 mb-4">
              Publique novos avisos para os moradores
            </p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
              Criar Aviso
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Gerenciar Boletos</h3>
            <p className="text-sm text-green-700 mb-4">
              Crie e gerencie boletos mensais
            </p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl">
              Criar Boleto
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-purple-900 mb-2">Ver Reclamações</h3>
            <p className="text-sm text-purple-700 mb-4">
              Analise e responda às reclamações
            </p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl">
              Ver Todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}