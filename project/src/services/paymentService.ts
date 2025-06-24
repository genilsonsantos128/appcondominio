// Payment Service for Mercado Pago Integration
export interface PaymentData {
  apartment: string;
  amount: number;
  description: string;
  dueDate: string;
  month: string;
  year: number;
  residentName: string;
  residentEmail: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  pixCode?: string;
  boletoUrl?: string;
  error?: string;
}

class PaymentService {
  private accessToken: string;
  private apiUrl: string;

  constructor() {
    this.accessToken = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN || '';
    this.apiUrl = 'https://api.mercadopago.com/v1';
  }

  async createPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      // Create payment preference
      const preference = {
        items: [
          {
            title: `Taxa Condominial - Apt ${paymentData.apartment} - ${paymentData.month}/${paymentData.year}`,
            description: paymentData.description,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: paymentData.amount
          }
        ],
        payer: {
          name: paymentData.residentName,
          email: paymentData.residentEmail
        },
        payment_methods: {
          excluded_payment_types: [],
          installments: 1
        },
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(paymentData.dueDate + 'T23:59:59.000Z').toISOString(),
        external_reference: `COND_${paymentData.apartment}_${paymentData.month}_${paymentData.year}`,
        notification_url: `${import.meta.env.VITE_API_URL}/webhooks/mercadopago`,
        back_urls: {
          success: `${window.location.origin}/payment/success`,
          failure: `${window.location.origin}/payment/failure`,
          pending: `${window.location.origin}/payment/pending`
        },
        auto_return: 'approved'
      };

      const response = await fetch(`${this.apiUrl}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preference)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        paymentId: data.id,
        paymentUrl: data.init_point,
        pixCode: data.pix_code,
        boletoUrl: data.init_point
      };
    } catch (error) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        error: 'Erro ao criar pagamento. Tente novamente.'
      };
    }
  }

  async createPixPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const payment = {
        transaction_amount: paymentData.amount,
        description: `Taxa Condominial - Apt ${paymentData.apartment} - ${paymentData.month}/${paymentData.year}`,
        payment_method_id: 'pix',
        payer: {
          email: paymentData.residentEmail,
          first_name: paymentData.residentName.split(' ')[0],
          last_name: paymentData.residentName.split(' ').slice(1).join(' ') || 'Morador'
        },
        external_reference: `COND_PIX_${paymentData.apartment}_${paymentData.month}_${paymentData.year}`,
        date_of_expiration: new Date(paymentData.dueDate + 'T23:59:59.000Z').toISOString()
      };

      const response = await fetch(`${this.apiUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        paymentId: data.id.toString(),
        pixCode: data.point_of_interaction?.transaction_data?.qr_code,
        paymentUrl: data.point_of_interaction?.transaction_data?.ticket_url
      };
    } catch (error) {
      console.error('PIX payment creation error:', error);
      return {
        success: false,
        error: 'Erro ao criar PIX. Tente novamente.'
      };
    }
  }

  async createBoletoPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const payment = {
        transaction_amount: paymentData.amount,
        description: `Taxa Condominial - Apt ${paymentData.apartment} - ${paymentData.month}/${paymentData.year}`,
        payment_method_id: 'bolbradesco',
        payer: {
          email: paymentData.residentEmail,
          first_name: paymentData.residentName.split(' ')[0],
          last_name: paymentData.residentName.split(' ').slice(1).join(' ') || 'Morador',
          identification: {
            type: 'CPF',
            number: '12345678901' // Em produção, coletar CPF real
          }
        },
        external_reference: `COND_BOL_${paymentData.apartment}_${paymentData.month}_${paymentData.year}`,
        date_of_expiration: new Date(paymentData.dueDate + 'T23:59:59.000Z').toISOString()
      };

      const response = await fetch(`${this.apiUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        paymentId: data.id.toString(),
        boletoUrl: data.transaction_details?.external_resource_url,
        paymentUrl: data.transaction_details?.external_resource_url
      };
    } catch (error) {
      console.error('Boleto payment creation error:', error);
      return {
        success: false,
        error: 'Erro ao criar boleto. Tente novamente.'
      };
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const response = await fetch(`${this.apiUrl}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Payment status error:', error);
      return null;
    }
  }
}

export const paymentService = new PaymentService();