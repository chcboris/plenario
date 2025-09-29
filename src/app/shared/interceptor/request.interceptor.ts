import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

import { Criptografia } from "../util/criptografia";

export function httpsRequestInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    let usuario =  sessionStorage.getItem('usuario');
    let token = usuario ? JSON.parse(Criptografia.decode(usuario)).token : '';

    if (token && (request.url.indexOf('autenticar') < 0 )) {
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }

    if (!request.headers.has('Content-Type')) {
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    //Evitar problema de cache em novas versões
    request = request.clone({
      headers: request.headers
        .set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma', 'no-cache')
        .set('Expires', '0')
    })

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
        if ((!!error.status && error.status === 403) ||
            ( (!!error.error && !!error.error.status && !!error.error.message) &&
                (error.error.status === 403 ||
                (error.error.message !== null && error.error.message !== 'undefined' && error.error.message.substring(0,3) === 'JWT')))){

            for(let i=0; i<100; i++)
            {
                clearInterval(i);
                clearTimeout(i);
            }
            sessionStorage.removeItem('token');

            alert('Sessão expirada - Recarregue a página');
        }
          return throwError(() => error);
        })
    );
}

