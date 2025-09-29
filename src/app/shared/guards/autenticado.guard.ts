import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Criptografia } from '../util/criptografia';

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
