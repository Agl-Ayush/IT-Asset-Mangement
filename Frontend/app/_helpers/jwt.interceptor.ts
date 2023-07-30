import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // stage 1: Check if request for refresh token
    if (request.url.indexOf('/auth/refresh') !== -1) {
      return next.handle(request);
    }
    const data = this.loginService.currentUserValue;
    const accessToken = data?.token;
    // stage 2: Checking access_token exists(mean user logged in) or not
    
    if (accessToken) {
      // stage 3: checking access_token validity
      // if (this.authService.isAuthTokenValid(accessToken)) {
        let modifiedReq = request.clone({
          headers: request.headers.append('x-access-token',accessToken)
        });
        return next.handle(modifiedReq);
      //}
      // stage 4: Going to generate new tokens
      return this.loginService.RefreshToken()
        .pipe(
          take(1),
          switchMap((res: any) => {
            let modifiedReq = request.clone({
              headers: request.headers.append('x-access-token', res?.data?.token)
            });
            return next.handle(modifiedReq)
          })
        )
      
    }
    return next.handle(request);
  }
}
