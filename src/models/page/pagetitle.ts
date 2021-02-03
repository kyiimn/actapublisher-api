import conn from '../../services/conn';

export interface IPageTitle {
    id?: number,
    title: string
};

export class PageTitle {
    private _id: number;
    private _title: string;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._title = dbdata.title;
    }

    static async create(data: IPageTitle): Promise<PageTitle | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'INSERT t_page_title (name) VALUES ($1, $2) RETURNING id',
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

    static async get(id: number): Promise<PageTitle | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query('SELECT id, name FROM t_page_title WHERE id=$1', [id]);
            if (res.rowCount < 1) return null;
            return new PageTitle(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<PageTitle[] | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query('SELECT id, name FROM t_page_title ORDER BY id ');
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PageTitle(row));
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
                'UPDATE t_page_title SET name=$1 WHERE id=$2',
                [this.title, this.id]
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
            const res = await client.query('DELETE FROM t_page_title WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get title() { return this._title; }
    get data(): IPageTitle {
        return {
            id: this.id,
            title: this.title
        };
    }

    set title(title) { this._title = title; }
};