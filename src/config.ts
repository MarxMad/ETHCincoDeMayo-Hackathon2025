export const config = {
  ungate: {
    apiUrl: process.env.REACT_APP_UNGATE_API_URL || 'https://api.ungate.ai/v1',
    apiKey: process.env.REACT_APP_UNGATE_API_KEY || '',
  },
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 500,
  },
  app: {
    name: process.env.REACT_APP_NAME || 'UniFood',
    description: process.env.REACT_APP_DESCRIPTION || 'Plataforma de gestión universitaria con IA',
  },
}

// Log para depuración
console.log('Configuración de OpenAI:', {
  apiKey: config.openai.apiKey ? 'API Key configurada' : 'API Key no configurada',
  model: config.openai.model,
}); 