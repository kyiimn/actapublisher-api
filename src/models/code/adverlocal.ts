import conn from '../../services/conn';

export interface IAdverLocalDef {
    id?: number,
    code: string,
    name: string,
    mediaId: number,
    mediaName?: string,
    sort: number,
    use: boolean
};

export class AdverLocalDef {
    private _id: number;
    private _code: string;
    private _name: string;
    private _mediaId: number;
    private _mediaName: string;
    private _sort: number;
    private _use: boolean;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._code = dbdata.code;
        this._name = dbdata.name;
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        this._sort = dbdata.sort;
        this._use = dbdata.use ? true : false;
    }

    static async create(data: IAdverLocalDef): Promise<AdverLocalDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_adver_local_def (code, name, media_id, sort, use) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [data.code, data.name, data.mediaId, data.sort, data.use ? 1 : 0]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<AdverLocalDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.code, A.name, A.media_id, A.sort, A.use, ' +
                ' M.name media_name ' +
                'FROM t_config_adver_local_def A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'WHERE A.id=$1',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new AdverLocalDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async getByCode(mediaId: number, code: string): Promise<AdverLocalDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.code, A.name, A.media_id, A.sort, A.use, ' +
                ' M.name media_name ' +
                'FROM t_config_adver_local_def A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'WHERE A.media_id=$1 AND A.code=$2',
                [mediaId, code]
            );
            if (res.rowCount < 1) return null;
            return new AdverLocalDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<AdverLocalDef[] | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.code, A.name, A.media_id, A.sort, A.use, ' +
                ' M.name media_name ' +
                'FROM t_config_adver_local_def A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'WHERE A.media_id=$1 ORDER BY A.media_id, A.sort, A.code, A.id ',
                [mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new AdverLocalDef(row));
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
                'UPDATE t_config_adver_local_def SET code=$1, name=$2, sort=$3, use=$4 WHERE id=$5',
                [this.code, this.name, this.sort, this.use ? 1 : 0, this.id]
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
            const res = await client.query('DELETE FROM t_config_adver_local_def WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get code() { return this._code; }
    get name() { return this._name; }
    get mediaId() { return this._mediaId; }
    get mediaName() { return this._mediaName; }
    get sort() { return this._sort; }
    get use() { return this._use; }
    get data(): IAdverLocalDef {
        return {
            id: this.id,
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