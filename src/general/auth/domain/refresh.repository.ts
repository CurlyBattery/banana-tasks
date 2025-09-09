import { RefreshM } from './refresh';

export abstract class RefreshRepository {
  abstract save(refresh: RefreshM): Promise<RefreshM>;
  abstract get(userId: number): Promise<RefreshM>;
  abstract setRevoke(id: number): Promise<RefreshM>;
  abstract remove(id: number): Promise<RefreshM>;
}
