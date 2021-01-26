import conn from '../../services/conn';

export interface IMediaDef {
    id: number,
    name: string,
    type: string
};

export class MediaDef {
    private _id: number;
    private _name: string;
    private _type: string;

    private constructor(data: any) {
        this._id = parseInt(data.id, 10);
        this._name = data.name;
        this._type = data.type;
    }

    static async create(data: IMediaDef): Promise<MediaDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_media_def (id, name, type) VALUES ($1, $2, $3) RETURNING id',
                [data.id, data.name, data.type]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<MediaDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, name, type FROM t_config_media_def WHERE id=$1', [id]);
            if (res.rowCount < 1) return null;
            return new MediaDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select() {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, name, type FROM t_config_media_def ORDER BY id');
            let ret = [];
            for (const row of res.rows) {
                ret.push(new MediaDef(row));
            }
            return ret;
        } catch (e) {
            return null;
        } finally { 
            client.release();
        }
    }

    static async selectByType(type: string): Promise<MediaDef[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, name, type FROM t_config_media_def WHERE type=$1 ORDER BY id', [type]);
            let ret = [];
            for (const row of res.rows) {
                ret.push(new MediaDef(row));
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
            const res = await client.query('UPDATE t_config_media_def SET name=$1, type=$2 WHERER id=$3', [this.name, this.type, this.id]);
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
            const res = await client.query('DELETE FROM t_config_media_def WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get type() { return this._type; }
    get data() {
        return {
            id: this.id,
            name: this.name,
            type: this.type
        };
    }

    set name(name) { this._name = name; }
    set type(type) { this._type = type; }
};