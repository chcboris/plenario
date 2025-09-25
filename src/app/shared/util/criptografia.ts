export class Criptografia {

  //BASE 64
  static encode(palavra: string) {
      let encoded: string = btoa(palavra);
      return encoded;
  }

  static decode(palavra: string) {
      let decoded: string = atob(palavra);
      return decoded;
  }

}
