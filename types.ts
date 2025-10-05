
export interface Note {
  id: string;
  nNota?: string;
  cliente: string;
  categoria: string;
  valor: number;
  dataEmissao: string; // ISO string date
  status: 'Pago' | 'Não Pago';
  materialServico?: string;
  veiculoPlaca?: string;
  createdAt: number;
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Role {
  canEdit: boolean;
  canView: boolean;
  modules: string[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  role: UserRole;
  permissions: Role;
}

export interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  status: string;
}

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  modules?: string[];
}

// ========== AHGORA API TYPES ==========

export interface AhgoraEmployee {
  pis: string;
  nome: string;
  matricula: string;
}

export interface AhgoraPunch {
  hora: string;
  tipo: "ENTRADA" | "SAIDA";
  fonte: string;
}

export interface AhgoraDayRecord {
  dia: number;
  data: string; // "YYYY-MM-DD"
  dia_da_semana: string;
  punches: AhgoraPunch[];
  absenteismo: boolean;
  total_trabalhado: string; // "HH:mm"
  extras: {
    '50': string; // "HH:mm"
    '100': string; // "HH:mm"
  };
  banco_de_horas: {
    credito: string, // "HH:mm"
    debito: string, // "HH:mm"
  }
}

export interface AhgoraTimesheet {
  mes: number;
  ano: number;
  pessoal: AhgoraEmployee;
  dias: AhgoraDayRecord[];
  totais: {
    trabalhado: string; // "HH:mm"
    extra_50: string; // "HH:mm"
    extra_100: string; // "HH:mm"
    banco_de_horas_credito: string;
    banco_de_horas_debito: string;
    absenteismo_dias: number;
  }
}
