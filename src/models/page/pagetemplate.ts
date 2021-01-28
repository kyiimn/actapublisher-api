import IPage from '.';
import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';

export interface IPageTemplate {
    id?: number,
    title: string,
    pageSizeId: number,
    regDate: string,
    regUserId: number,
    modifyDate?: string,
    modifyUserId?: number,
    adverSizeId: number,
    whole: boolean,
    fileStorageId: number
};

export class PageTemplate extends IPage {
    private _id: number;
    private _title: string;
    private _pageSizeId: number;
    private _regDate: string;
    private _regUserId: number;
    private _modifyDate?: string;
    private _modifyUserId?: number;
    private _adverSizeId: number;
    private _whole: boolean;
    private _fileStorageId: number;

    private constructor(dbdata: any) {
        super();

        this._id = parseInt(dbdata.id, 10);
        this._title = dbdata.title;
        this._pageSizeId = parseInt(dbdata.page_size_id, 10);
        this._regDate = dbdata.reg_date;
        this._regUserId = dbdata.reg_user_id;
        if (dbdata.modify_date) this._modifyDate = dbdata.modify_date;
        if (dbdata.modify_user_id) this._modifyUserId = parseInt(dbdata.modify_user_id, 10);
        this._adverSizeId = parseInt(dbdata.adver_size_id, 10);
        this._whole = dbdata.whole ? true : false;
        this._fileStorageId = parseInt(dbdata.file_storage_id, 10);
    }

    get id() { return this._id; }
    get title() { return this._title; }
    get pageSizeId() { return this._pageSizeId; }
    get regDate() { return this._regDate; }
    get regUserId() { return this._regUserId; }
    get modifyDate() { return this._modifyDate; }
    get modifyUserId() { return this._modifyUserId; }
    get adverSizeId() { return this._adverSizeId; }
    get whole() { return this._whole; }
    get fileStorageId() { return this._fileStorageId; }
    get data() {
        return {
            id: this.id,
            title: this.title,
            pageSizeId: this.pageSizeId,
            regDate: this.regDate,
            regUserId: this.regUserId,
            modifyDate: this.modifyDate,
            modifyUserId: this.modifyUserId,
            adverSizeId: this.adverSizeId,
            whole: this.whole,
            fileStorageId: this.fileStorageId
        }
    }
    set title(title) { this._title = title; }
    set adverSizeId(adverSizeId) { this._adverSizeId = adverSizeId; }
    set modifyUserId(modifyUserId) { this._modifyUserId = modifyUserId; }

    static async create(data: IPageTemplate): Promise<PageTemplate | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_page_template (title, page_size_id, reg_date, reg_user_id, adver_size_id, whole, file_storage_id) VALUES ($1,$2,now(),$3,$4,$5,$6) RETURNING id ',
                [data.title, data.pageSizeId, data.regUserId, data.adverSizeId, data.whole, data.fileStorageId]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<PageTemplate | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, title, page_size_id, ' +
                ' TO_CHAR(reg_date, \'YYYYMMDDHH24MMISS\') reg_date, reg_user_id, ' +
                ' TO_CHAR(modify_date, \'YYYYMMDDHH24MMISS\') modify_date, modify_user_id ' +
                ' adver_size_id, whole, file_storage_id ' +
                'FROM t_page_pattern WHERE id=$1 ',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new PageTemplate(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<PageTemplate[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, title, page_size_id, ' +
                ' TO_CHAR(reg_date, \'YYYYMMDDHH24MMISS\') reg_date, reg_user_id, ' +
                ' TO_CHAR(modify_date, \'YYYYMMDDHH24MMISS\') modify_date, modify_user_id ' +
                ' adver_size_id, whole, file_storage_id ' +
                'FROM t_page_pattern ORDER BY reg_date DESC ',
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PageTemplate(row));
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
                'UPDATE t_page_template SET title=$1, adver_size_id=$2, modify_date=now(), modify_user_id=$3 WHERE id=$4',
                [this.title, this.adverSizeId, this.modifyUserId, this.id]
            );
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
            const res = await client.query('DELETE FROM t_page_template WHERE id=$1', [this.id]);
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
            const res = await client.query('UPDATE t_page_pattern SET lock=1, lock_date=now(), lock_user_id=$1 WHERE id=$2', [userId, this.id]);
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
                'FROM t_page_pattern C LEFT JOIN t_account_user U ON C.lock_user_id=U.id ' +
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
                res = await client.query('UPDATE t_page_pattern SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 AND lock_user_id=$4', [null, null, this.id, userId]);
            } else {
                res = await client.query('UPDATE t_page_pattern SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 ', [null, null, this.id]);
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
                res = await client.query('SELECT count(*) cnt FROM t_page_pattern WHERE id=$1 AND lock_user_id=$2 AND lock=1', [this.id, userId]);
            } else {
                res = await client.query('SELECT count(*) cnt FROM t_page_pattern WHERE id=$1 AND lock=1', [this.id]);
            }
            return (res.rowCount > 0) ? true : false;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }
};