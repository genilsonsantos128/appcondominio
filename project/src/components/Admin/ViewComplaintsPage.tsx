import React from 'react';
import { MessageSquare, Calendar, Tag, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function ViewComplaintsPage() {
  const { complaints, updateComplaintStatus } = useData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'Manutenção';
      case 'noise':
        return 'Barulho';
      case 'security':
        return 'Segurança';
      case 'cleaning':
        return 'Limpeza';
      default:
        return 'Outros';
    }
  };

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'in-progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reclamações</h1>
          <p className="text-gray-600">Gerencie as reclamações dos moradores</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Em Andamento</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolvidas</p>
              <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Todas as Reclamações</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-medium text-gray-800">{complaint.title}</h3>
                    <span className={`px-3 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      <span>
                        {complaint.status === 'pending' ? 'Pendente' :
                         complaint.status === 'in-progress' ? 'Em Andamento' : 'Resolvida'}
                      </span>
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {complaint.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(complaint.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="h-3 w-3" />
                      <span>{getCategoryLabel(complaint.category)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {complaint.status === 'pending' && (
                    <button
                      onClick={() => updateComplaintStatus(complaint.id, 'in-progress')}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Iniciar
                    </button>
                  )}
                  {complaint.status === 'in-progress' && (
                    <button
                      onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Resolver
                    </button>
                  )}
                  {complaint.status === 'resolved' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-lg">
                      Concluída
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {complaints.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhuma reclamação</h3>
          <p className="text-gray-600">Não há reclamações para revisar no momento.</p>
        </div>
      )}
    </div>
  );
}