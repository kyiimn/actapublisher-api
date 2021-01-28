import conn from '../../services/conn';

export interface ISectionDef {
    id?: number,
    code: string,
    name: string,
    mediaId: number,
    use: boolean
};

export class SectionDef {
    private _id: number;
    private _code: string;
    private _name: string;
    private _mediaId: number;
    private _use: boolean;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._code = dbdata.code;
        this._name = dbdata.name;
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._use = dbdata.use ? true : false;
    }

    static async create(data: ISectionDef): Promise<SectionDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_section_def (code, name, media_id, use) VALUES ($1, $2, $3, $4) RETURNING id',
                [data.code, data.name, data.mediaId, data.use ? 1 : 0]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<SectionDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, code, name, media_id, use FROM t_config_section_def WHERE id=$1', [id]);
            if (res.rowCount < 1) return null;
            return new SectionDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async getByCode(mediaId: number, section: string): Promise<SectionDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT id, code, name, media_id, use FROM t_config_section_def WHERE media_id=$1 AND section=$2',
                [mediaId, section]
            );
            if (res.rowCount < 1) return null;
            return new SectionDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<SectionDef[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT id, code, name, media_id, use FROM t_config_section_def WHERE media_id=$1 ORDER BY media_id, code, id ',
                [mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new SectionDef(row));
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
                'UPDATE t_config_section_def SET code=$1, name=$2, use=$3 WHERE id=$4',
                [this.code, this.name, this.use ? 1 : 0, this.id]
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
            const res = await client.query('DELETE FROM t_config_section_def WHERE id=$1', [this.id]);
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
    get use() { return this._use; }
    get data() {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            mediaId: this.mediaId,
            use: this.use
        };
    }

    set code(code) { this._code = code; }
    set name(name) { this._name = name; }
    set use(use) { this._use = use; }
};