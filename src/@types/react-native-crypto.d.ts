declare module 'react-native-crypto' {
    import { Buffer } from 'buffer';
  
    const crypto: typeof import('crypto');
    export = crypto;
  }
  