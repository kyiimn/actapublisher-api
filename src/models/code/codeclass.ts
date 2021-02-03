import { timeStamp } from 'console';
import conn from '../../services/conn';

export interface ICodeClassDef {
    id?: number,
    class: number,
    code: string,
    name: string,
    mediaId?: number,
    mediaName?: string,
    sort?: number,
    use: boolean
};

export class CodeClassDef {
    private _id: number;
    private _class: number;
    private _code: string;
    private _name: string;
    private _mediaId?: number;
    private _mediaName?: string;
    private _sort?: number;
    private _use: boolean;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._class = parseInt(dbdata.class, 10);
        this._code = dbdata.code;
        this._name = dbdata.name;
        if (dbdata.media_id) this._mediaId = parseInt(dbdata.media_id, 10);
        if (dbdata.media_name) this._mediaName = dbdata.media_name;
        if (dbdata.sort) this._sort = dbdata.sort;
        this._use = dbdata.use ? true : false;
    }

    static readonly CLASS_MEDIATYPE = 1;
    static readonly CLASS_SOURCE = 2;
    static readonly CLASS_COPYRIGHT = 3;
    static readonly CLASS_ADVERTYPE = 5;
    static readonly CLASS_BODYTYPE = 6;
    static readonly CLASS_ARTICLETYPE = 7;
    static readonly CLASS_ARTICLESTATUS = 8;
    static readonly CLASS_IMAGETYPE = 9;
    static readonly CLASS_PAPERTYPE = 10;
    static readonly CLASS_PAPERDIRECTION = 11;
    static readonly CLASS_UNIT = 12;
    static readonly CLASS_OBJECTTYPE = 13;
    static readonly CLASS_FRAMETYPE = 14;
    static readonly CLASS_PAGESTATUS = 15;
    static readonly CLASS_PAGEPRINTSTATUS = 16;
    static readonly CLASS_IMAGESTATUS = 17;
    static readonly CLASS_PAGEADVERSTATUS = 18;
    static readonly CLASS_ADVERSTATUS = 19;

    static async create(data: ICodeClassDef): Promise<CodeClassDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_code_def (class, code, name, media_id, sort, use) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [data.class, data.code, data.name, data.mediaId ? data.mediaId : null, data.sort ? data.sort : null, data.use ? 1 : 0]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<CodeClassDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' C.id, C.class, C.code, C.name, C.media_id, C.sort, C.use, M.name media_name ' +
                'FROM t_config_code_def C ' +
                'LEFT JOIN t_config_media_def M ON M.id = C.media_id ' +
                'WHERE C.id=$1',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new CodeClassDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async getByCode(codeClass: number, code: string): Promise<CodeClassDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' C.id, C.class, C.code, C.name, C.media_id, C.sort, C.use, M.name media_name ' +
                'FROM t_config_code_def C ' +
                'LEFT JOIN t_config_media_def M ON M.id = C.media_id ' +
                'WHERE C.class=$1 AND C.code=$2',
                [codeClass, code]
            );
            if (res.rowCount < 1) return null;
            return new CodeClassDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<CodeClassDef[] | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' C.id, C.class, C.code, C.name, C.media_id, C.sort, C.use, M.name media_name ' +
                'FROM t_config_code_def C ' +
                'LEFT JOIN t_config_media_def M ON M.id = C.media_id ' +
                'WHERE (C.media_id=$1 OR C.media_id IS NULL) ' +
                'ORDER BY C.class, C.media_id, C.sort, C.code, C.id ',
                [mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new CodeClassDef(row));
            }
            return ret;
        } catch (e) {
            return null;
        } finally { 
            client.release();
        }
    }

    async save() {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'UPDATE t_config_code_def SET code=$1, name=$2, sort=$3, use=$4 WHERE id=$5',
                [this.code, this.name, this.sort ? this.sort : null, this.use ? 1 : 0, this.id]
            );
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async delete() {
        const client = await conn.getClient();
        try {
            const res = await client.query('DELETE FROM t_config_code_def WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get class() { return this._class; }
    get code() { return this._code; }
    get name() { return this._name; }
    get mediaId() { return this._mediaId; }
    get mediaName() { return this._mediaName; }
    get sort() { return this._sort; }
    get use() { return this._use; }
    get data(): ICodeClassDef {
        return {
            id: this.id,
            class: this.class,
            code: this.code,
            name: this.name,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            sort: this.sort,
            use: this.use
        };
    }

    set code(code) { this._code = code; }
    set name(name) { this._name = name; }
    set sort(sort) { this._sort = sort; }
    set use(use) { this._use = use; }
};