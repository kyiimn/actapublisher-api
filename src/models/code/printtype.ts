import conn from '../../services/conn';

export interface IPrintTypeDef {
    id: number,
    name: string
};

export class PrintTypeDef {
    private _id: number;
    private _name: string;

    private constructor(data: any) {
        this._id = parseInt(data.id, 10);
        this._name = data.name;
    }

    static async create(data: IPrintTypeDef): Promise<PrintTypeDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_print_type_def (id, name) VALUES ($1, $2) RETURNING id',
                [data.id, data.name]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<PrintTypeDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, name FROM t_config_print_type_def WHERE id=$1', [id]);
            if (res.rowCount < 1) return null;
            return new PrintTypeDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<PrintTypeDef[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, name FROM t_config_print_type_def ORDER BY id ');
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PrintTypeDef(row));
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
                'UPDATE t_config_print_type_def SET name=$1 WHERE id=$2',
                [this.name, this.id]
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
            const res = await client.query('DELETE FROM t_config_print_type_def WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get data() {
        return {
            id: this.id,
            name: this.name
        };
    }

    set name(name) { this._name = name; }
};