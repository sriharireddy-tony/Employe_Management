import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared.module';
// import { AuthModule } from './Modules/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './Components/home/home.component';
import { TokenHandlingInterceptor } from './Interceptors/token-handling.interceptor';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({positionClass:'toast-bottom-right',timeOut: 2000}),
    SharedModule,
    // AuthModule,
    HttpClientModule,
  ],
  providers: [DatePipe,
    [
      { provide: HTTP_INTERCEPTORS, useClass: TokenHandlingInterceptor, multi: true }
    ]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
