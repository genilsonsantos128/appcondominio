import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notice, Complaint, Bill } from '../types';

interface DataContextType {
  notices: Notice[];
  complaints: Complaint[];
  bills: Bill[];
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  updateBillPayment: (billId: string, paymentId: string, paymentUrl: string) => void;
  getAllApartments: () => string[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const initialNotices: Notice[] = [
  {
    id: '1',
    title: 'Manutenção do Elevador',
    description: 'O elevador principal estará em manutenção na próxima segunda-feira das 8h às 17h. Pedimos a compreensão de todos os moradores.',
    date: '2024-01-15',
    priority: 'high',
    author: 'Administração'
  },
  {
    id: '2',
    title: 'Reunião de Condomínio',
    description: 'Reunião ordinária será realizada no dia 25/01 às 19h no salão de festas. Pauta: aprovação do orçamento anual.',
    date: '2024-01-10',
    priority: 'medium',
    author: 'Síndico'
  },
  {
    id: '3',
    title: 'Nova Política de Pets',
    description: 'Informamos sobre as novas regras para animais de estimação nas áreas comuns do condomínio.',
    date: '2024-01-08',
    priority: 'low',
    author: 'Administração'
  }
];

const initialComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Barulho excessivo no apartamento 203',
    description: 'Vizinho fazendo muito barulho durante a madrugada, prejudicando o descanso dos demais moradores.',
    category: 'noise',
    date: '2024-01-14',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Problema na iluminação do corredor',
    description: 'Lâmpadas queimadas no corredor do 3º andar, deixando o local muito escuro.',
    category: 'maintenance',
    date: '2024-01-12',
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'Limpeza inadequada da área comum',
    description: 'A limpeza do salão de festas não está sendo feita adequadamente após os eventos.',
    category: 'cleaning',
    date: '2024-01-10',
    status: 'resolved'
  }
];

const initialBills: Bill[] = [
  {
    id: '1',
    apartment: '101',
    month: 'Janeiro',
    year: 2024,
    amount: 350.50,
    dueDate: '2024-01-10',
    status: 'pending',
    downloadUrl: '#',
    description: 'Taxa Condominial + Fundo de Reserva',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    apartment: '101',
    month: 'Dezembro',
    year: 2023,
    amount: 325.00,
    dueDate: '2023-12-10',
    status: 'paid',
    downloadUrl: '#',
    description: 'Taxa Condominial',
    createdAt: '2023-12-01T00:00:00Z'
  },
  {
    id: '3',
    apartment: '202',
    month: 'Janeiro',
    year: 2024,
    amount: 380.75,
    dueDate: '2024-01-10',
    status: 'pending',
    downloadUrl: '#',
    description: 'Taxa Condominial + Multa Atraso',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    apartment: '303',
    month: 'Janeiro',
    year: 2024,
    amount: 340.00,
    dueDate: '2024-01-10',
    status: 'paid',
    downloadUrl: '#',
    description: 'Taxa Condominial',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [bills, setBills] = useState<Bill[]>(initialBills);

  const addNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...notice,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...bill,
      id: Date.now().toString()
    };
    setBills(prev => [newBill, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
  };

  const updateBillPayment = (billId: string, paymentId: string, paymentUrl: string) => {
    setBills(prev => 
      prev.map(bill => 
        bill.id === billId 
          ? { ...bill, paymentId, paymentUrl, status: 'pending' as const }
          : bill
      )
    );
  };

  const getAllApartments = (): string[] => {
    // Get unique apartments from bills and add some common ones
    const apartmentsFromBills = [...new Set(bills.map(bill => bill.apartment))];
    const commonApartments = ['101', '102', '103', '201', '202', '203', '301', '302', '303'];
    const allApartments = [...new Set([...apartmentsFromBills, ...commonApartments])];
    return allApartments.sort();
  };

  return (
    <DataContext.Provider value={{
      notices,
      complaints,
      bills,
      addNotice,
      addComplaint,
      addBill,
      updateComplaintStatus,
      updateBillPayment,
      getAllApartments
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}