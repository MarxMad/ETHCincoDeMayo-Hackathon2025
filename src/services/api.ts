import axios from 'axios';
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

// Declarar window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('Error de solicitud:', {
        request: error.request,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      // Algo sucedió al configurar la solicitud
      console.error('Error de configuración:', error.message);
    }

    if (error.response?.status === 401) {
      // Redirigir al login si el token es inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface VerifyScholarshipRequest {
  studentId: string;
  walletAddress: string;
  signature: string;
}

interface Scholarship {
  id: string;
  amount: number;
  status: 'available' | 'claimed' | 'pending';
  type: string;
  requirements: string[];
  expirationDate: string;
  usageHistory?: {
    date: string;
    amount: number;
    location: string;
  }[];
}

// Dirección del contrato en Mantle Testnet
const SCHOLARSHIP_CONTRACT_ADDRESS = '0x83501eAE542748590639649f2E951B653C509b1b';

// ABI del contrato (solo la función registeredStudents)
const SCHOLARSHIP_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_alumno",
        "type": "address"
      }
    ],
    "name": "registeredStudents",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const scholarshipService = {
  // Verificar si un estudiante está registrado
  isStudentRegistered: async (studentAddress: string): Promise<boolean> => {
    if (!window.ethereum) {
      throw new Error('No se encontró MetaMask');
    }

    try {
      // Validar dirección
      if (!ethers.isAddress(studentAddress)) {
        throw new Error('Dirección inválida');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      console.log('Red conectada:', network);

      if (network.chainId !== BigInt(5003)) {
        throw new Error('Por favor, conéctate a Mantle Testnet (ID: 5003)');
      }

      // Crear una instancia del contrato
      const contract = new ethers.Contract(
        SCHOLARSHIP_CONTRACT_ADDRESS,
        SCHOLARSHIP_CONTRACT_ABI,
        provider
      );

      console.log('Consultando registro para:', studentAddress);
      
      // Llamar a la función directamente
      const isRegistered = await contract.registeredStudents(studentAddress);
      console.log('Resultado de la consulta:', isRegistered);

      return isRegistered;
    } catch (error) {
      console.error('Error detallado:', error);
      if (error instanceof Error) {
        throw new Error(`Error al verificar registro de estudiante: ${error.message}`);
      }
      throw error;
    }
  },

  // Registrar estudiante
  registerStudent: async (studentAddress: string): Promise<boolean> => {
    if (!window.ethereum) {
      throw new Error('No se encontró MetaMask');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== BigInt(5003)) {
        throw new Error('Por favor, conéctate a Mantle Testnet (ID: 5003)');
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        SCHOLARSHIP_CONTRACT_ADDRESS,
        SCHOLARSHIP_CONTRACT_ABI,
        signer
      );

      console.log('Registrando estudiante:', studentAddress);
      
      // Enviar la transacción con un límite de gas fijo
      const tx = await contract.registerStudent(studentAddress, {
        gasLimit: 300000 // Límite de gas fijo para mayor seguridad
      });
      
      console.log('Transacción enviada:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transacción confirmada:', receipt.hash);
      
      return true;
    } catch (error) {
      console.error('Error detallado:', error);
      if (error instanceof Error) {
        throw new Error(`Error al registrar estudiante: ${error.message}`);
      }
      throw error;
    }
  },

  // Verificar beca
  verifyScholarship: async (data: VerifyScholarshipRequest): Promise<Scholarship> => {
    const response = await api.post<Scholarship>('/api/scholarships/verify', data);
    return response.data;
  },

  // Obtener detalles de la beca
  getScholarshipDetails: async (scholarshipId: string): Promise<Scholarship> => {
    const response = await api.get<Scholarship>(`/api/scholarships/${scholarshipId}`);
    return response.data;
  },

  // Obtener historial de transacciones
  getTransactionHistory: async (scholarshipId: string) => {
    const response = await api.get(`/api/scholarships/${scholarshipId}/transactions`);
    return response.data;
  },

  // Realizar pago
  makePayment: async (scholarshipId: string, amount: number, location: string) => {
    const response = await api.post(`/api/scholarships/${scholarshipId}/payments`, {
      amount,
      location,
    });
    return response.data;
  },
};

export const authService = {
  // Iniciar sesión
  login: async (walletAddress: string, signature: string) => {
    const response = await api.post('/auth/login', {
      walletAddress,
      signature,
    });
    return response.data;
  },

  // Verificar sesión
  verifySession: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export default api; 