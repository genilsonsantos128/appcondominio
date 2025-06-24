import React, { useState } from 'react';
import { CreditCard, Plus, Upload, Download, Calendar, DollarSign, Trash2, Check } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function ManageBillsPage() {
  const { bills, addBill, getAllApartments } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    apartment: '',
    month: '',
    year: new Date().getFullYear(),
    amount: '',
    dueDate: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const apartments = getAllApartments();
  const currentYear = new Date().getFullYear();
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Check if bill already exists for this apartment/month/year
      const existingBill = bills.find(
        bill => bill.apartment === formData.apartment && 
                bill.month === formData.month && 
                bill.year === formData.year
      );

      if (existingBill) {
        setMessage({ type: 'error', text: 'Já existe um boleto para este apartamento neste mês/ano' });
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      addBill({
        apartment: formData.apartment,
        month: formData.month,
        year: formData.year,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: 'pending',
        downloadUrl: '#',
        description: formData.description || `Taxa Condominial - ${formData.month}/${formData.year}`,
        createdAt: new Date().toISOString()
      });

      setMessage({ type: 'success', text: 'Boleto criado com sucesso!' });
      setFormData({
        apartment: '',
        month: '',
        year: currentYear,
        amount: '',
        dueDate: '',
        description: ''
      });
      setShowForm(false);

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar boleto. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'overdue':
        return 'Vencido';
      default:
        return 'Pendente';
    }
  };

  const totalBills = bills.length;
  const pendingBills = bills.filter(b => b.status === 'pending').length;
  const paidBills = bills.filter(b => b.status === 'paid').length;
  const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Boletos</h1>
          <p className="text-gray-600">Crie e gerencie boletos para os apartamentos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Boleto</span>
        </button>
      </div>

      {message.text && (
        <div className={`flex items-center space-x-2 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <CreditCard className="h-5 w-5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Boletos</p>
              <p className="text-2xl font-bold text-gray-800">{totalBills}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingBills}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pagos</p>
              <p className="text-2xl font-bold text-green-600">{paidBills}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Criar Novo Boleto</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apartamento
                </label>
                <select
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione o apartamento</option>
                  {apartments.map(apt => (
                    <option key={apt} value={apt}>Apartamento {apt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mês
                </label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione o mês</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {[currentYear - 1, currentYear, currentYear + 1].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Taxa Condominial + Fundo de Reserva"
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Criar Boleto</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bills List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Boletos Criados</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {bills.map((bill) => (
            <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-800">
                      Apartamento {bill.apartment} - {bill.month}/{bill.year}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bill.status)}`}>
                      {getStatusText(bill.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {bill.description || `Taxa Condominial - ${bill.month}/${bill.year}`}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Vencimento: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>R$ {bill.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // Simulate bill download
                      const link = document.createElement('a');
                      link.href = '#';
                      link.download = `boleto_${bill.apartment}_${bill.month}_${bill.year}.pdf`;
                      link.click();
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Baixar boleto"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir boleto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {bills.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum boleto criado</h3>
          <p className="text-gray-600">Comece criando boletos para os apartamentos.</p>
        </div>
      )}
    </div>
  );
}