/**
 * AI Client Service
 * Encargado de orquestar las llamadas a las IAs directamente desde el cliente
 * respetando la privacidad de las API Keys del usuario.
 */

export type AIProvider = 'gemini' | 'openai' | 'claude';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIClient {
  private provider: AIProvider;
  private apiKey: string;

  constructor(provider: AIProvider, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  async sendMessage(systemPrompt: string, history: Message[]): Promise<string> {
    if (this.provider === 'gemini') {
      return this.callGemini(systemPrompt, history);
    }
    // Otros proveedores se añadirían aquí
    return "Provider no implementado todavía.";
  }

  private async callGemini(systemPrompt: string, history: Message[]): Promise<string> {
    try {
      // Endpoint oficial de Google Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: history.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.role === 'system' ? `${systemPrompt}\n\n${m.content}` : m.content }]
          }))
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Hubo un error al conectar con Gemini. Revisa tu API Key.";
    }
  }
}
