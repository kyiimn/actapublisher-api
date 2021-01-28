import IPage from '.';
import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';

export interface IPagePattern {
    id?: number,
    title: string,
    regDate: string,
    regUserId: number,
    modifyDate?: string,
    modifyUserId?: number,
    data: { [key: string]: any }
};

export class PagePattern extends IPage {
    private _id: number;
    private _title: string;
    private _regDate: string;
    private _regUserId: number;
    private _modifyDate?: string;
    private _modifyUserId?: number;
    private _data: { [key: string]: any };

    private constructor(dbdata: any) {
        super();

        this._id = parseInt(dbdata.id, 10);
        this._title = dbdata.title;
        this._regDate = dbdata.reg_date;
        this._regUserId = dbdata.reg_user_id;
        if (dbdata.modify_date) this._modifyDate = dbdata.modify_date;
        if (dbdata.modify_user_id) this._modifyUserId = parseInt(dbdata.modify_user_id, 10);
        this._data = dbdata.data;
    }

    get id() { return this._id; }
    get title() { return this._title; }
    get regDate() { return this._regDate; }
    get regUserId() { return this._regUserId; }
    get modifyDate() { return this._modifyDate; }
    get modifyUserId() { return this._modifyUserId; }
    get rawdata() { return this._data; }
    get data() {
        return {
            id: this.id,
            title: this.title,
            regDate: this.regDate,
            regUserId: this.regUserId,
            modifyDate: this.modifyDate,
            modifyUserId: this.modifyUserId,
            rawdata: this.rawdata
        }
    }
    set title(title) { this._title = title; }
    set modifyUserId(modifyUserId) { this._modifyUserId = modifyUserId; }
    set rawdata(rawdata) { this._data = rawdata; }

    static async create(data: IPagePattern): Promise<PagePattern | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_page_pattern (title, reg_date, reg_user_id, data, lock) VALUES ($1, now(), $2, $3, 1) RETURNING id',
                [data.title]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<PagePattern | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, title, ' +
                ' TO_CHAR(reg_date, \'YYYYMMDDHH24MMISS\') reg_date, reg_user_id, ' +
                ' TO_CHAR(modify_date, \'YYYYMMDDHH24MMISS\') modify_date, modify_user_id ' +
                'FROM t_page_pattern WHERE id=$1 ',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new PagePattern(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<PagePattern[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, title, ' +
                ' TO_CHAR(reg_date, \'YYYYMMDDHH24MMISS\') reg_date, reg_user_id, ' +
                ' TO_CHAR(modify_date, \'YYYYMMDDHH24MMISS\') modify_date, modify_user_id ' +
                'FROM t_page_pattern ORDER BY reg_date DESC ',
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PagePattern(row));
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
                'UPDATE t_page_pattern SET title=$1, modify_date=now(), modify_user_id=$2 WHERE id=$3',
                [this.title, this.modifyUserId, this.id]
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
            const res = await client.query('DELETE FROM t_page_pattern WHERE id=$1', [this.id]);
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