import axios from 'axios';
import { config } from '../config';

interface UngateResponse {
  response: string;
  context: string;
  timestamp: string;
}

interface UngateError {
  message: string;
  code: string;
  details?: any;
}

const ungateService = {
  async sendMessage(message: string, context: string = 'unifood'): Promise<string> {
    if (!config.ungate.apiKey) {
      throw new Error('API key de Ungate no configurada');
    }

    try {
      const response = await axios.post<UngateResponse>(
        `${config.ungate.apiUrl}/chat`,
        {
          message,
          context: await this.getContext(),
          options: {
            language: 'es',
            tone: 'friendly',
            maxTokens: 500,
            temperature: 0.7,
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${config.ungate.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000, // 10 segundos de timeout
        }
      );

      return response.data.response;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        (error as any).isAxiosError
      ) {
        const axiosError = error as any;
        const ungateError = axiosError.response?.data as UngateError;
        console.error('Error de Ungate:', {
          message: ungateError?.message || axiosError.message,
          code: ungateError?.code || axiosError.code,
          details: ungateError?.details,
        });

        if (axiosError.response?.status === 401) {
          return 'Lo siento, hay un problema de autenticación con el servicio. Por favor, contacta al soporte.';
        }

        if (axiosError.response?.status === 429) {
          return 'El servicio está recibiendo muchas solicitudes. Por favor, intenta de nuevo en unos minutos.';
        }
      }

      return 'Lo siento, estoy teniendo problemas para procesar tu solicitud. Por favor, intenta de nuevo más tarde.';
    }
  },

  async getContext(): Promise<string> {
    return `
      Eres un asistente virtual de UniFood, una plataforma de gestión de becas estudiantiles.
      Tu nombre es UniBot y eres amigable, profesional y siempre respondes en español.

      Funcionalidades principales:
      - Gestión de becas estudiantiles
      - Pagos en cafeterías del campus
      - Consultas de saldo
      - Información general de la plataforma

      Reglas importantes:
      1. Siempre responde de manera clara y concisa
      2. Usa un tono amigable pero profesional
      3. Si no estás seguro de algo, pide más detalles
      4. Para pagos, guía al usuario a través del proceso
      5. Para consultas de saldo, verifica el balance actual
      6. Para preguntas sobre becas, proporciona información detallada

      Si el usuario necesita ayuda con algo fuera de estas funciones,
      sugiérele contactar al soporte técnico de UniFood.
    `;
  },

  async validateApiKey(): Promise<boolean> {
    if (!config.ungate.apiKey) {
      return false;
    }

    try {
      await axios.get(`${config.ungate.apiUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${config.ungate.apiKey}`,
        },
        timeout: 5000,
      });
      return true;
    } catch (error) {
      console.error('Error al validar la API key:', error);
      return false;
    }
  }
};

export default ungateService; 