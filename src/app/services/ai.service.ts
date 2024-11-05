import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private session: any = null;
  private processingSubject = new BehaviorSubject<boolean>(false);
  processing$ = this.processingSubject.asObservable();
  constructor() {
    this.initializeSession();
  }

  private async initializeSession() {
    if (!chrome?.ai?.languageModel) {
      throw new Error('Chrome AI API not available');
    }
    this.session = await chrome.ai.languageModel.create({
      temperature: 0.7,
      topK: 40,
    });
  }

  async generateSummary(text: string): Promise<string> {
    this.processingSubject.next(true);
    try {
      const prompt = `Summarize the following text concisely, highlighting key points:\n\n${text}`;
      const response = await this.streamResponse(prompt);
      return response;
    } finally {
      this.processingSubject.next(false);
    }
  }

  async simplifyText(text: string, mode: 'basic' | 'technical'): Promise<string> {
    const prompt = mode === 'basic'
      ? `Simplify this text for general understanding:\n\n${text}`
      : `Break down this technical content, explaining specific terms:\n\n${text}`;
    return this.streamResponse(prompt);
  }

  async generateQuiz(content: string, type: 'multiple' | 'fillblank' | 'truefalse'): Promise<string> {
    const promptMap = {
      multiple: 'Create 3 multiple choice questions',
      fillblank: 'Create 3 fill-in-the-blank questions',
      truefalse: 'Create 3 true/false questions'
    };
    const prompt = `Based on this content:\n\n${content}\n\n${promptMap[type]}`;
    return this.streamResponse(prompt);
  }

  async explainTerm(term: string, context?: string): Promise<string> {
    const prompt = context
      ? `Explain the term "${term}" in the context of ${context}`
      : `Explain the term "${term}" in simple terms`;
    return this.streamResponse(prompt);
  }

  private async streamResponse(prompt: string): Promise<string> {
    let fullResponse = '';
    try {
      const stream = await this.session.promptStreaming(prompt);
      for await (const chunk of stream) {
        fullResponse += chunk;
      }
      return fullResponse.trim();
    } catch (error: any) {
      throw new Error(`AI processing error: ${error.message}`);
    }
  }
}