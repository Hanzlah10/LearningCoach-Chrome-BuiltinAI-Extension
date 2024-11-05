import { Component } from '@angular/core';
import { AIService } from '../../services/ai.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-study-tools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './study-tools.component.html',
  styleUrls: ['./study-tools.component.css']
})
export class StudyToolsComponent {
  result: string = '';
  processing$ = this.aiService.processing$;

  constructor(private aiService: AIService) { }

  async summarizeSelectedText() {
    const selectedText = window.getSelection()?.toString();
    if (!selectedText) {
      alert('Please select some text first');
      return;
    }
    try {
      this.result = await this.aiService.generateSummary(selectedText);
    } catch (error: any) {
      this.result = `Error: ${error.message}`;
    }
  }

  async simplifyText(mode: 'basic' | 'technical') {
    const selectedText = window.getSelection()?.toString();
    if (!selectedText) {
      alert('Please select some text first');
      return;
    }
    try {
      this.result = await this.aiService.simplifyText(selectedText, mode);
    } catch (error: any) {
      this.result = `Error: ${error.message}`;
    }
  }

  async generateQuiz(type: 'multiple' | 'fillblank' | 'truefalse') {
    const selectedText = window.getSelection()?.toString();
    if (!selectedText) {
      alert('Please select some text first');
      return;
    }
    try {
      this.result = await this.aiService.generateQuiz(selectedText, type);
    } catch (error: any) {
      this.result = `Error: ${error.message}`;
    }
  }
}
