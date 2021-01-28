import IPage from '.';
import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';

export interface IPageAdver {
    id?: string,
    publishId: number,
    editionId: number,
    adverLocalId: number,
    adverSizeId: number,
    userId: number,
    fileStorageId: number,
    status: string
}

export class PageAdver extends IPage {
    private _id: string;
    private _publishId: number;
    private _editionId: number;
    private _adverLocalId: number;
    private _adverSizeId: number;
    private _userId: number;
    private _fileStorageId: number;
    private _status: string;

    private constructor(dbdata: any) {
        super();

        this._id = dbdata.id;
        this._publishId = parseInt(dbdata.publish_id, 10);
        this._editionId = parseInt(dbdata.edition_id, 10);
        this._adverLocalId = parseInt(dbdata.adver_local_id, 10);
        this._adverSizeId = parseInt(dbdata.adver_size_id, 10);
        this._userId = parseInt(dbdata.user_id, 10);
        this._fileStorageId = parseInt(dbdata.file_storage_id, 10);
        this._status = dbdata.status;
    }

    get id() { return this._id; }
    get publishId() { return this._publishId; }
    get editionId() { return this._editionId; }
    get adverLocalId() { return this._adverLocalId; }
    get adverSizeId() { return this._adverSizeId; }
    get userId() { return this._userId; }
    get fileStorageId() { return this._fileStorageId; }
    get status() { return this._status; }
    get date() {
        return {
            id: this.id,
            publishId: this.publishId,
            editionId: this.editionId,
            adverLocalId: this.adverLocalId,
            adverSizeId: this.adverSizeId,
            userId: this.userId,
            fileStorageId: this.fileStorageId,
            status: this.status
        };
    }
    set adverSizeId(adverSizeId) { this._adverSizeId = adverSizeId; }
    set status(status) { this._status = status; }

    static async create(data: IPageAdver): Promise<PageAdver | null> {
        const client = await conn.in.getClient();
        try {
            const newId = await this.generateId();
            if (!newId) return null;

            const res = await client.query(
                'INSERT t_page_adver (' +
                ' id, publish_id, edition_id, adver_local_id, adver_size_id, user_id, file_storage_id, status ' +
                ') VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
                [
                    newId, data.publishId, data.editionId, data.adverLocalId, data.adverSizeId, data.userId, data.fileStorageId, data.status
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

    static async get(id: string): Promise<PageAdver | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, publish_id, edition_id, adver_local_id, adver_size_id, user_id, file_storage_id, status ' +
                'FROM t_page_adver WHERE id=$1',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new PageAdver(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByPubInfo(publishId: number): Promise<PageAdver[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, publish_id, edition_id, adver_local_id, adver_size_id, user_id, file_storage_id, status ' +
                'FROM t_page_adver WHERE publish_id=$1 ORDER BY edition_id ',
                [publishId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PageAdver(row));
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
                'UPDATE t_page_adver SET adver_size_id=$1, status=$2 WHERE id=$3 AND lock=1 ',
                [this.adverSizeId, this.status, this.id]
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
            const res = await client.query('DELETE FROM t_page_adver WHERE id=$1', [this.id]);
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
            const res = await client.query('UPDATE t_page_adver SET lock=1, lock_date=now(), lock_user_id=$1 WHERE id=$2', [userId, this.id]);
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
                'FROM t_page_adver C LEFT JOIN t_account_user U ON C.lock_user_id=U.id ' +
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
                res = await client.query('UPDATE t_page_adver SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 AND lock_user_id=$4', [null, null, this.id, userId]);
            } else {
                res = await client.query('UPDATE t_page_adver SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 ', [null, null, this.id]);
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
                res = await client.query('SELECT count(*) cnt FROM t_page_adver WHERE id=$1 AND lock_user_id=$2 AND lock=1', [this.id, userId]);
            } else {
                res = await client.query('SELECT count(*) cnt FROM t_page_adver WHERE id=$1 AND lock=1', [this.id]);
            }
            return (res.rowCount > 0) ? true : false;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }
}
