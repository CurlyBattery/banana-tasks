export class RefreshM {
  id?: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  revoked?: boolean;

  createdAt?: Date;
}
