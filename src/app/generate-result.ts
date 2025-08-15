import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, shareReplay, switchMap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GenerateResult {
chatIndex = -1;
  private genAI: GoogleGenAI;

  private q$ = new BehaviorSubject<{ ques: string, image?: string } | null>(null);

  result$: Observable<any> = this.q$.pipe(
    switchMap(req => {
      if (!req) return of(null);  // Prevent errors if no question is sent

      const parts: any[] = [];

      // Add text part
      if (req.ques) {
        parts.push({ text: req.ques });
      }

      // Add image part if present
      if (req.image) {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: req.image.split(',')[1] // base64 content
          }
        });
      }

      const contents = [
        {
          role: 'user',
          parts
        }
      ];

      return from(
        this.genAI.models.generateContent({
          model: 'gemini-2.0-flash-001',
          contents
        })
      );
    }),
    shareReplay(1)
  );

  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: environment.API_KEY });
  }

  sendQuestion(ques: string, image?: string) {
    this.q$.next({ ques, image });
  }
}
