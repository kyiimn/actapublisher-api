import conn from '../../services/conn';

export interface IClosingTimeDef {
    id?: number,
    closingDate?: string,
    closingTime: string,
    mediaId: number,
    page: number,
    editionId: number
};

export class ClosingTimeDef {
    private _id: number;
    private _closingDate?: string;
    private _closingTime: string;
    private _mediaId: number;
    private _page: number;
    private _editionId: number;

    private constructor(data: any) {
        this._id = parseInt(data.id, 10);
        if (data.closing_date) this._closingDate = data.closing_date;
        this._closingTime = data.closing_time;
        this._mediaId = parseInt(data.media_id, 10);
        this._page = data.page;
        this._editionId = parseInt(data.edition_id, 10);
    }

    static async create(data: IClosingTimeDef): Promise<ClosingTimeDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_closing_time_def (closing_date, closing_time, media_id, page, edition_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [data.closingDate ? data.closingDate : null, data.closingTime, data.mediaId, data.page, data.editionId]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<ClosingTimeDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, closing_date, closing_time, media_id, page, edition_id FROM t_config_closing_time_def WHERE id=$1', [id]);
            if (res.rowCount < 1) return null;
            return new ClosingTimeDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<ClosingTimeDef[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT id, closing_date, closing_time, media_id, page, edition_id FROM t_config_closing_time_def WHERE media_id=$1 ORDER BY media_id, id ',
                [mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new ClosingTimeDef(row));
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
                'UPDATE t_config_closing_time_def SET closing_date=$1, closing_time=$2, page=$3, edition_id=$4 WHERE id=$5',
                [this.closingDate, this.closingTime, this.page, this.editionId, this.id]
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
            const res = await client.query('DELETE FROM t_config_closing_time_def WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get closingDate() { return this._closingDate; }
    get closingTime() { return this._closingTime; }
    get mediaId() { return this._mediaId; }
    get page() { return this._page; }
    get editionId() { return this._editionId; }
    get data() {
        return {
            id: this.id,
            closingDate: this.closingDate,
            closingTime: this.closingTime,
            mediaId: this.mediaId,
            page: this.page,
            editionId: this.editionId
        };
    }

    set closingDate(closingDate) { this._closingDate = closingDate; }
    set closingTime(closingTime) { this._closingTime = closingTime; }
    set page(page) { this._page = page; }
    set editionId(editionId) { this._editionId = editionId; }
};