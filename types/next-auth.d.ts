import type { Role } from '@/lib/permissions';
import type { DefaultSession } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Exclude<Role, 'guest'>;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    role: Exclude<Role, 'guest'>;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: Exclude<Role, 'guest'>;
  }
}
