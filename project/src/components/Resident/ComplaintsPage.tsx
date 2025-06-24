import React, { useState } from 'react';
import { MessageSquare, Send, Plus, Check } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function ComplaintsPage() {
  const { addComplaint } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as const
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'noise', label: 'Barulho' },
    { value: 'security', label: 'Segurança' },
    { value: 'cleaning', label: 'Limpeza' },
    { value: 'other', label: 'Outros' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula envio
      addComplaint(formData);
      setFormData({ title: '', description: '', category: 'other' });
      setShowForm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reclamações</h1>
          <p className="text-gray-600">Envie sua reclamação de forma anônima</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Reclamação</span>
        </button>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-800">
            <Check className="h-5 w-5" />
            <span className="font-medium">Reclamação enviada com sucesso!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Sua reclamação foi enviada de forma anônima para a administração.
          </p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Nova Reclamação</h2>
            <p className="text-sm text-gray-600 mt-1">
              Sua identidade será mantida em sigilo. Descreva o problema de forma clara e objetiva.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Resumo da reclamação"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva o problema em detalhes..."
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Enviando...' : 'Enviar Reclamação'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Como Funciona</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">1. Escreva sua reclamação</h3>
              <p className="text-sm text-gray-600">
                Descreva o problema de forma clara e objetiva
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">2. Envio anônimo</h3>
              <p className="text-sm text-gray-600">
                Sua identidade é mantida em total sigilo
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">3. Administração recebe</h3>
              <p className="text-sm text-gray-600">
                A administração analisa e toma as medidas necessárias
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}