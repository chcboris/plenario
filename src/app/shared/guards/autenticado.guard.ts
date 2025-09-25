import { Criptografia } from '../util/criptografia';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const autenticadoGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = sessionStorage.getItem('usuario');

  let usuario: any = null;
  usuario = user ? JSON.parse(Criptografia.decode(user)) : null;

  if (usuario && usuario.token) {
    return true;
  } else {
    return router.parseUrl('/');
  }
};
