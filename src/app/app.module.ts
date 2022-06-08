import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogoComponent } from './sidebar/logo.component';
import { StoryListComponent } from './sidebar/story-list.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ViewerComponent } from './viewer/viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    StoryListComponent,
    SidebarComponent,
    LogoComponent,
    ViewerComponent,
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatTreeModule,
    AppRoutingModule,
    FormsModule,
    NoopAnimationsModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
