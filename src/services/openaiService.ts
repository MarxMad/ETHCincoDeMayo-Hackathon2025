import OpenAI from 'openai';
import { config } from '../config';

interface OpenAIResponse {
  content: string;
  role: string;
}

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  dangerouslyAllowBrowser: true // Necesario para usar en el navegador
});

const openaiService = {
  async sendMessage(message: string): Promise<string> {
    if (!config.openai.apiKey) {
      console.error('API key no configurada');
      throw new Error('API key de OpenAI no configurada');
    }

    try {
      console.log('Enviando mensaje a OpenAI...');
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: "system",
            content: `Eres un asistente virtual de UniFood, una plataforma de gestión universitaria. 
            Tu función es ayudar a los estudiantes con:
            - Información sobre becas
            - Procesamiento de pagos
            - Consultas de saldo
            - Preguntas generales sobre la plataforma
            
            Mantén un tono amigable y profesional en español.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: config.openai.temperature,
        max_tokens: config.openai.maxTokens,
      });

      return completion.choices[0].message.content || 'Lo siento, no pude generar una respuesta.';
    } catch (error: any) {
      console.error('Error de OpenAI:', error);
      
      if (error.response?.status === 401) {
        throw new Error('API key de OpenAI inválida. Por favor, verifica tu configuración.');
      } else if (error.response?.status === 429) {
        throw new Error('Has excedido el límite de solicitudes. Por favor, intenta más tarde.');
      } else {
        throw new Error('Error al comunicarse con OpenAI. Por favor, intenta nuevamente.');
      }
    }
  },

  async validateApiKey(): Promise<boolean> {
    if (!config.openai.apiKey) {
      console.error('API key no configurada en validación');
      return false;
    }

    try {
      console.log('Validando API key...');
      await openai.models.list();
      console.log('API key válida');
      return true;
    } catch (error: any) {
      console.error('Error al validar API key:', error);
      return false;
    }
  }
};

export default openaiService; 