/**
 * AI Client Service - Multi-Provider Support
 * Maneja llamadas directas desde el navegador a Gemini, Groq y OpenAI.
 */

export type AIProvider = 'gemini' | 'groq' | 'openai';

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
    switch (this.provider) {
      case 'gemini': return this.callGemini(systemPrompt, history);
      case 'groq': return this.callGroq(systemPrompt, history);
      case 'openai': return this.callOpenAI(systemPrompt, history);
      default: return "Proveedor no soportado.";
    }
  }

  private async callGemini(systemPrompt: string, history: Message[]): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
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
  }

  private async callGroq(systemPrompt: string, history: Message[]): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...history]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callOpenAI(systemPrompt: string, history: Message[]): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...history]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
