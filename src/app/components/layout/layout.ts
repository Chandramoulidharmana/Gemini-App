import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GenerateResult } from '../../generate-result';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
  standalone: false,
})
export class Layout {
  isSidebarOpen = false;
  message: any = {};
  messages: any[] = [];
  history: any[][] = [];
  fileBase64: string | null = null;
  isBrowser: boolean;
  searchText = '';
  promptQuestion: string = '';
  filename = 'Choose Image';
  isLoadingShown = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _generateS: GenerateResult
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    _generateS.result$.subscribe((res: { candidates: { content: { parts: { text: string; }[]; }; }[]; }) => {
      const text: any = res?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[No response]';
      this.pushToMessages(text, 'chatBot', null);
      this.isLoadingShown = false;
      this.scrollToBottom();
    });
  }

  ngOnInit(): void {
    if (this.isBrowser && localStorage.getItem('history')) {
      try {
        this.history = JSON.parse(localStorage.getItem('history')!);

      } catch {
        this.history = [];
      }
    }
    this.checkSideBar();
  }

  leftStyle() {
    return {
      width: this.isSidebarOpen ? '260px' : '0px',
      transition: 'width 0.3s ease',
    };
  }

  rightStyle() {
    return {
      width: this.isSidebarOpen ? 'calc(100% - 260px)' : '100%',
      transition: 'width 0.3s ease',
    };
  }

  getSearchBarStyle() {
    return {
      width: this.isSidebarOpen ? '400px' : '100%',
    };
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.fileBase64 = reader.result as string;
      this.filename = file.name;
    };
    reader.readAsDataURL(file);
  }

  scrollToBottom(): void {
    if (!this.isBrowser) return;
    setTimeout(() => {
      const content = document.getElementById('chatMessage');
      if (content) {
        content.scrollTop = content.scrollHeight;
      }
    }, 200);
  }

  pushToMessages(message: any, sender: any, file: any): void {
    this.messages.push({ message, sender, image: file });
    const messagesLength = this.messages.length;

    if (messagesLength === 1) {
      this.history.unshift(this.messages);
      this._generateS.chatIndex = 0;
    } else {
      this.history.splice(this._generateS.chatIndex, 1, this.messages);
    }

    if (this.isBrowser) {
      localStorage.setItem('history', JSON.stringify(this.history));
    }
  }

  createNewChat(): void {
    this.messages = [];
    this.message = {};
    this.promptQuestion = '';
    this.fileBase64 = null;
    this.filename = 'Choose Image';
    if (this.isBrowser) {
      document.getElementById('prompt')?.focus();
    }
    this._generateS.chatIndex = -1;
  }

  openChat(chat: any): void {
    this.messages = chat;
    this.scrollToBottom();
  }

  search(): void {
    const results = this.searchText ? this.searchByText(this.searchText) : [];
    if (results.length) {
      this.history = results;
    } else if (this.isBrowser) {
      this.history = JSON.parse(localStorage.getItem('history') || '[]');
    }
  }

  searchByText(term: string): any[][] {
    const lower = term.toLowerCase();
    return this.history.filter((chat) =>
      chat.some((item) =>
        typeof item.message === 'string' && item.message.toLowerCase().includes(lower)
      )
    );
  }

  sendPrompt(): void {
    if (!this.promptQuestion.trim() && !this.fileBase64) return;

    const question = this.promptQuestion || 'Image';
    const image = this.fileBase64;

    this._generateS.sendQuestion(this.promptQuestion, this.fileBase64 ?? undefined);
    this.pushToMessages(question, 'user', image);

    this.promptQuestion = '';
    this.fileBase64 = null;
    this.filename = 'Choose Image';
    this.isLoadingShown = true;
    this.scrollToBottom();
  }

  getImageBtnColor() {
    return {
      color: this.filename === 'Choose Image' ? '#44474e' : 'rgb(0, 0, 110)',
    };
  }

  isDisableSendButton() {
    return !(this.promptQuestion || this.fileBase64) || this.isLoadingShown;
  }

  checkSideBar(): void {
    this.isSidebarOpen = this.isBrowser && window.innerWidth > 800;
  }
}
