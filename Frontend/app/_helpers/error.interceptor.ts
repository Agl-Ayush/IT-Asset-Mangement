import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoginService } from '../services/login.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    [x: string]: any;

    constructor(private snackbar: MatSnackBar) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((res) => this.errorHandler(res)));
    }

    private errorHandler(response: any): Observable<any> {

        const status = response?.status;

        // if (status === 401 || status === 403) {
        //     this.LoginService.logout();
        // }

        const error = response.error;

        let message = response.message;

        if (typeof error === 'object') {

            const keys = Object.keys(error);

            if (keys.some(item => item === 'message')) {

                message = error.message;

            }

        } else if (typeof error === 'string') {
            message = error;
        }
        this.snackbar.open(message,'close', { duration: 2000 });
        return throwError({ message, status });
    }
}


