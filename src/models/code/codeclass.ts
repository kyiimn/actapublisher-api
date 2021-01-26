import conn from '../../services/conn';

export interface ICodeClassDef {
    id?: number,
    class: number,
    code: string,
    name: string,
    mediaId?: number,
    sort?: number,
    use: boolean
};

export class CodeClassDef {
    private _id: number;
    private _class: number;
    private _code: string;
    private _name: string;
    private _mediaId?: number;
    private _sort?: number;
    private _use: boolean;

    private constructor(data: any) {
        this._id = parseInt(data.id, 10);
        this._class = parseInt(data.class, 10);
        this._code = data.code;
        this._name = data.name;
        if (data.media_id) this._mediaId = parseInt(data.media_id, 10);
        if (data.sort) this._sort = data.sort;
        this._use = data.use ? true : false;
    }

    static async create(data: ICodeClassDef): Promise<CodeClassDef | null> {
        const client = await conn.in.getClient();
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, class, code, name, media_id, sort, use FROM t_config_code_def WHERE id=$1', [id]);
            if (res.rowCount < 1) return null;
            return new CodeClassDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async getByCode(codeClass: number, code: string): Promise<CodeClassDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT id, class, code, name, media_id, sort, use FROM t_config_code_def WHERE class=$1 AND code=$2',
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT id, class, code, name, media_id, sort, use FROM t_config_code_def WHERE (media_id=$1 OR media_id IS NULL) ORDER BY class, media_id, sort, code, id ',
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
        const client = await conn.in.getClient();
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
        const client = await conn.in.getClient();
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
    get sort() { return this._sort; }
    get use() { return this._use; }
    get data() {
        return {
            id: this.id,
            class: this.class,
            code: this.code,
            name: this.name,
            mediaId: this.mediaId,
            sort: this.sort,
            use: this.use
        };
    }

    set code(code) { this._code = code; }
    set name(name) { this._name = name; }
    set sort(sort) { this._sort = sort; }
    set use(use) { this._use = use; }
};