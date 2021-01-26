import conn from '../../services/conn';

export interface IStorageDef {
    id: number,
    name: string,
    basePath: string,
    archive: boolean
};

export class StorageDef {
    private _id: number;
    private _name: string;
    private _basePath: string;
    private _archive: boolean;

    private constructor(data: any) {
        this._id = parseInt(data.id, 10);
        this._name = data.name;
        this._basePath = data.base_path;
        this._archive = data.archive ? true : false;
    }

    static async create(data: IStorageDef): Promise<StorageDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_storage_def (id, name, base_path, archive) VALUES ($1, $2, $3, $4) RETURNING id',
                [data.id, data.name, data.basePath, data.archive ? 1 : 0]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<StorageDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, name, base_path, archive FROM t_config_storage_def WHERE id=$1', [id]);
            if (res.rowCount < 1) return null;
            return new StorageDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<StorageDef[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, name, base_path, archive FROM t_config_storage_def ORDER BY id ');
            let ret = [];
            for (const row of res.rows) {
                ret.push(new StorageDef(row));
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
                'UPDATE t_config_storage_def SET name=$1, base_path=$2, archive=$3 WHERE id=$4',
                [this.name, this.basePath, this.archive ? 1 : 0, this.id]
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
            const res = await client.query('DELETE FROM t_config_storage_def WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get basePath() { return this._basePath; }
    get archive() { return this._archive; }
    get data() {
        return {
            id: this.id,
            name: this.name,
            basePath: this.basePath,
            archive: this.archive
        };
    }

    set name(name) { this._name = name; }
    set basePath(basePath) { this._basePath = basePath; }
    set archive(archive) { this._archive = archive; }
};