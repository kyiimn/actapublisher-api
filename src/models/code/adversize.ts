import conn from '../../services/conn';

export interface IAdverSizeDef {
    id: number,
    name: string,
    mediaId: number,
    mediaName?: string,
    use: boolean
};

export class AdverSizeDef {
    private _id: number;
    private _name: string;
    private _mediaId: number;
    private _mediaName: string;
    private _use: boolean;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._name = dbdata.name;
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        this._use = dbdata.use ? true : false;
    }

    static async create(data: IAdverSizeDef): Promise<AdverSizeDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_adver_size_def (id, name, media_id, use) VALUES ($1, $2, $3, $4) RETURNING id',
                [data.id, data.name, data.mediaId, data.use ? 1 : 0]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<AdverSizeDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.name, A.media_id, A.use, M.name media_name ' +
                'FROM t_config_adver_size_def A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'WHERE A.id=$1',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new AdverSizeDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async getByMediaId(mediaId: number, id: number): Promise<AdverSizeDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.name, A.media_id, A.use, M.name media_name ' +
                'FROM t_config_adver_size_def A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'WHERE A.media_id=$1 AND A.id=$2',
                [mediaId, id]
            );
            if (res.rowCount < 1) return null;
            return new AdverSizeDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<AdverSizeDef[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.name, A.media_id, A.use, M.name media_name ' +
                'FROM t_config_adver_size_def A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'WHERE A.media_id=$1 ORDER BY A.media_id, A.id ',
                [mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new AdverSizeDef(row));
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
                'UPDATE t_config_adver_size_def SET name=$1, use=$2 WHERE id=$3',
                [this.name, this.use ? 1 : 0, this.id]
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
            const res = await client.query('DELETE FROM t_config_adver_size_def WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get mediaId() { return this._mediaId; }
    get mediaName() { return this._mediaName; }
    get use() { return this._use; }
    get data(): IAdverSizeDef {
        return {
            id: this.id,
            name: this.name,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            use: this.use
        };
    }

    set name(name) { this._name = name; }
    set use(use) { this._use = use; }
};