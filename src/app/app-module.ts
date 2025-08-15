import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Layout } from './components/layout/layout';
import { Sidebar } from './components/sidebar/sidebar';
import { Bubble } from './components/bubble/bubble';
import {FormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    App,
    Layout,
    Sidebar,
    Bubble
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    MatListModule,
    MatListItem,
    MatCardModule,
    
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
