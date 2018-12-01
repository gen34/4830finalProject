import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, en_US , NzFormModule } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { AppCircleComponent } from './components/app-circle/app-circle.component';
import { InformationComponent } from './information/information.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    AppCircleComponent,
    InformationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
