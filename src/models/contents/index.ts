import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';

export default abstract class IContent {
    protected static async generateId(): Promise<string | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT generate_id() id');
            if (res.rowCount < 1) return null;
            return res.rows[0].id;
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    abstract setLock(userId: number): Promise<boolean>;
    abstract getLock(): Promise<ILockInfo | null>;
    abstract releaseLock(userId?: number): Promise<boolean>;
    abstract isLock(userId?: number): Promise<boolean>;
}