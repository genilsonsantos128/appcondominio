import React from 'react';
import { FileText, Calendar, User, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function NoticesPage() {
  const { notices } = useData();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta Prioridade';
      case 'medium':
        return 'Média Prioridade';
      default:
        return 'Baixa Prioridade';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <AlertCircle className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Avisos do Condomínio</h1>
          <p className="text-gray-600">Fique por dentro das informações importantes</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FileText className="h-5 w-5" />
          <span>{notices.length} avisos</span>
        </div>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">{notice.title}</h2>
                    <span className={`px-3 py-1 text-xs rounded-full border flex items-center space-x-1 ${getPriorityColor(notice.priority)}`}>
                      {getPriorityIcon(notice.priority)}
                      <span>{getPriorityText(notice.priority)}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">{notice.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(notice.date).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{notice.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum aviso encontrado</h3>
          <p className="text-gray-600">Não há avisos publicados no momento.</p>
        </div>
      )}
    </div>
  );
}