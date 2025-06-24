import React, { useState } from 'react';
import { X, CreditCard, Smartphone, FileText, Copy, Check, ExternalLink } from 'lucide-react';
import { paymentService, PaymentData } from '../../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentData;
  onPaymentCreated: (paymentId: string, paymentUrl: string) => void;
}

export function PaymentModal({ isOpen, onClose, paymentData, onPaymentCreated }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'boleto' | 'card'>('pix');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [pixCopied, setPixCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreatePayment = async () => {
    setIsLoading(true);
    try {
      let result;
      
      switch (selectedMethod) {
        case 'pix':
          result = await paymentService.createPixPayment(paymentData);
          break;
        case 'boleto':
          result = await paymentService.createBoletoPayment(paymentData);
          break;
        default:
          result = await paymentService.createPayment(paymentData);
      }

      if (result.success) {
        setPaymentResult(result);
        if (result.paymentId && result.paymentUrl) {
          onPaymentCreated(result.paymentId, result.paymentUrl);
        }
      } else {
        alert(result.error || 'Erro ao criar pagamento');
      }
    } catch (error) {
      alert('Erro inesperado ao criar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPixCode = () => {
    if (paymentResult?.pixCode) {
      navigator.clipboard.writeText(paymentResult.pixCode);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Gerar Pagamento</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!paymentResult ? (
            <>
              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Detalhes do Pagamento</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Apartamento:</span>
                    <span className="font-medium">{paymentData.apartment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Período:</span>
                    <span className="font-medium">{paymentData.month}/{paymentData.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vencimento:</span>
                    <span className="font-medium">{new Date(paymentData.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-bold text-lg text-green-600">R$ {paymentData.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Escolha a forma de pagamento</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedMethod('pix')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === 'pix'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-800">PIX</div>
                        <div className="text-sm text-gray-600">Pagamento instantâneo</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('boleto')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === 'boleto'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-orange-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-800">Boleto Bancário</div>
                        <div className="text-sm text-gray-600">Pague em qualquer banco</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('card')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === 'card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-800">Cartão de Crédito</div>
                        <div className="text-sm text-gray-600">Parcelamento disponível</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreatePayment}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Gerando...</span>
                  </>
                ) : (
                  <span>Gerar Pagamento</span>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Payment Result */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Pagamento Gerado!</h3>
                <p className="text-gray-600">Seu pagamento foi criado com sucesso</p>
              </div>

              {selectedMethod === 'pix' && paymentResult.pixCode && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Código PIX</h4>
                  <div className="bg-white rounded border p-3 mb-3">
                    <code className="text-xs break-all text-gray-700">
                      {paymentResult.pixCode}
                    </code>
                  </div>
                  <button
                    onClick={copyPixCode}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    {pixCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copiar Código PIX</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {paymentResult.paymentUrl && (
                <button
                  onClick={() => window.open(paymentResult.paymentUrl, '_blank')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 mb-4"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>
                    {selectedMethod === 'boleto' ? 'Baixar Boleto' : 
                     selectedMethod === 'pix' ? 'Abrir PIX' : 'Ir para Pagamento'}
                  </span>
                </button>
              )}

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Guarde o ID do pagamento: <code className="bg-yellow-200 px-1 rounded">{paymentResult.paymentId}</code>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}