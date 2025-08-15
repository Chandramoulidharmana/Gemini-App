import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-bubble',
  standalone: false,
  templateUrl: './bubble.html',
  styleUrl: './bubble.scss'
})
export class Bubble {
  @Input() i: any;
  updatedMessage: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.parse();
  }

  async parse() {
    if (this.i?.sender === 'chatBot' && this.i?.message) {
      const parsedText = await marked.parse(this.i.message);
      this.updatedMessage = this.sanitizer.bypassSecurityTrustHtml(parsedText);
    } else {
      this.updatedMessage = this.i?.message || '';
    }
  }

  getIcon(): string {
    if (this.i?.sender === 'user') return 'person';
    if (this.i?.sender === 'chatBot') return 'auto_awesome';
    return '';
  }
}
