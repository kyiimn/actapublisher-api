import IPage from '.';
import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';

export interface IPageLayout {
    id?: string,
    publishId: number,
    editionId: number,
    localId: number,
    userId: number,
    fileStorageId: number,
    title: string,
    status: string
}

export class PageLayout extends IPage {
    private _id: string;
    private _publishId: number;
    private _editionId: number;
    private _localId: number;
    private _userId: number;
    private _fileStorageId: number;
    private _title: string;
    private _status: string;

    private constructor(dbdata: any) {
        super();

        this._id = dbdata.id;
        this._publishId = parseInt(dbdata.publish_id, 10);
        this._editionId = parseInt(dbdata.edition_id, 10);
        this._localId = parseInt(dbdata.local_id, 10);
        this._userId = parseInt(dbdata.user_id, 10);
        this._fileStorageId = parseInt(dbdata.file_storage_id, 10);
        this._title = dbdata.title;
        this._status = dbdata.status;
    }

    get id() { return this._id; }
    get publishId() { return this._publishId; }
    get editionId() { return this._editionId; }
    get localId() { return this._localId; }
    get userId() { return this._userId; }
    get fileStorageId() { return this._fileStorageId; }
    get title() { return this._title; }
    get status() { return this._status; }
    get date() {
        return {
            id: this.id,
            publishId: this.publishId,
            editionId: this.editionId,
            localId: this.localId,
            userId: this.userId,
            fileStorageId: this.fileStorageId,
            title: this.title,
            status: this.status
        };
    }
    set title(title) { this._title = title; }
    set status(status) { this._status = status; }

    static async create(data: IPageLayout): Promise<PageLayout | null> {
        const client = await conn.in.getClient();
        try {
            const newId = await this.generateId();
            if (!newId) return null;

            const res = await client.query(
                'INSERT t_page (' +
                ' id, publish_id, edition_id, local_id, user_id, file_storage_id, title, status ' +
                ') VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
                [
                    newId, data.publishId, data.editionId, data.localId, data.userId, data.fileStorageId, data.title, data.status
                ]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: string): Promise<PageLayout | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, publish_id, edition_id, local_id, user_id, file_storage_id, title, status ' +
                'FROM t_page WHERE id=$1',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new PageLayout(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByPubInfo(publishId: number): Promise<PageLayout[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, publish_id, edition_id, local_id, user_id, file_storage_id, title, status ' +
                'FROM t_page WHERE publish_id=$1 ORDER BY edition_id ',
                [publishId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PageLayout(row));
            }
            return ret;
        } catch (e) {
            return null;
        } finally { 
            client.release();
        }
    }

    async save() {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'UPDATE t_page SET title=$1, status=$2 WHERE id=$3 AND lock=1 ',
                [this.title, this.status, this.id]
            );
            if (res.rowCount < 1) return null;

            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async delete() {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('DELETE FROM t_page WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async setLock(userId: number): Promise<boolean> {
        if (await this.isLock()) return false;

        const client = await conn.in.getClient();
        try {
            const res = await client.query('UPDATE t_page SET lock=1, lock_date=now(), lock_user_id=$1 WHERE id=$2', [userId, this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async getLock(): Promise<ILockInfo | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT ' +
                ' C.lock lock, TO_CHAR(C.lock_date, \'YYYYMMDDHH24MMISS\') lock_date, ' +
                ' C.lock_user_id lock_user_id, U.name lock_user_name ' +
                'FROM t_page C LEFT JOIN t_account_user U ON C.lock_user_id=U.id ' +
                'WHERE C.id=$1 ',
                [this.id]
            );
            if (res.rowCount < 1) return null;
            return {
                lockDate: res.rows[0].lockDate,
                lockUserId: parseInt(res.rows[0].lock_user_id, 10),
                lockUserName: res.rows[0].lock_user_name
            }
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    async releaseLock(userId?: number): Promise<boolean> {
        if (await this.isLock(userId)) return false;

        const client = await conn.in.getClient();
        try {
            let res;
            if (userId) {
                res = await client.query('UPDATE t_page SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 AND lock_user_id=$4', [null, null, this.id, userId]);
            } else {
                res = await client.query('UPDATE t_page SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 ', [null, null, this.id]);
            }
            return res.rowCount > 0 ? true : false;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async isLock(userId?: number): Promise<boolean> {
        const client = await conn.in.getClient();
        try {
            let res;
            if (userId) {
                res = await client.query('SELECT count(*) cnt FROM t_page WHERE id=$1 AND lock_user_id=$2 AND lock=1', [this.id, userId]);
            } else {
                res = await client.query('SELECT count(*) cnt FROM t_page WHERE id=$1 AND lock=1', [this.id]);
            }
            return (res.rowCount > 0) ? true : false;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }
}
