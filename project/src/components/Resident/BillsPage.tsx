import React, { useState } from 'react';
import { CreditCard, Download, Calendar, DollarSign, Smartphone, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PaymentModal } from '../Payment/PaymentModal';
import { PaymentData } from '../../services/paymentService';

export function BillsPage() {
  const { bills, updateBillPayment } = useData();
  const { user } = useAuth();
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const userBills = bills.filter(bill => bill.apartment === user?.apartment);

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

  const handlePayBill = (bill: any) => {
    const paymentData: PaymentData = {
      apartment: bill.apartment,
      amount: bill.amount,
      description: bill.description || `Taxa Condominial - ${bill.month}/${bill.year}`,
      dueDate: bill.dueDate,
      month: bill.month,
      year: bill.year,
      residentName: user?.name || 'Morador',
      residentEmail: user?.email || 'morador@email.com'
    };

    setSelectedBill({ ...bill, paymentData });
    setShowPaymentModal(true);
  };

  const handlePaymentCreated = (paymentId: string, paymentUrl: string) => {
    if (selectedBill) {
      updateBillPayment(selectedBill.id, paymentId, paymentUrl);
    }
  };

  const totalPending = userBills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const totalPaid = userBills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Boletos</h1>
          <p className="text-gray-600">Apartamento {user?.apartment}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total de boletos</p>
          <p className="text-2xl font-bold text-gray-800">{userBills.length}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Valor Pendente</p>
              <p className="text-2xl font-bold text-yellow-600">
                R$ {totalPending.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pago</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalPaid.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Boletos Pendentes</p>
              <p className="text-2xl font-bold text-gray-800">
                {userBills.filter(bill => bill.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Formas de Pagamento Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">PIX</p>
              <p className="text-sm text-blue-700">Pagamento instantâneo</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">Boleto</p>
              <p className="text-sm text-blue-700">Pague em qualquer banco</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">Cartão</p>
              <p className="text-sm text-blue-700">Crédito e débito</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Histórico de Boletos</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {userBills.map((bill) => (
            <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-800">
                      Taxa Condominial - {bill.month}/{bill.year}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bill.status)}`}>
                      {getStatusText(bill.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Vencimento: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>R$ {bill.amount.toFixed(2)}</span>
                    </div>
                  </div>
                  {bill.paymentId && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        ID do Pagamento: <code className="bg-gray-100 px-1 rounded">{bill.paymentId}</code>
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">
                      R$ {bill.amount.toFixed(2)}
                    </p>
                  </div>
                  {bill.status === 'pending' ? (
                    <button
                      onClick={() => handlePayBill(bill)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Pagar</span>
                    </button>
                  ) : bill.paymentUrl ? (
                    <button
                      onClick={() => window.open(bill.paymentUrl, '_blank')}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Ver Pagamento</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // Simulate download for paid bills without payment URL
                        const link = document.createElement('a');
                        link.href = '#';
                        link.download = `comprovante_${bill.month}_${bill.year}.pdf`;
                        link.click();
                      }}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Comprovante</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {userBills.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhum boleto encontrado</h3>
          <p className="text-gray-600">Não há boletos disponíveis para este apartamento.</p>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentData={selectedBill?.paymentData}
        onPaymentCreated={handlePaymentCreated}
      />
    </div>
  );
}