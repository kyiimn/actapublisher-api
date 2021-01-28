import conn from '../../services/conn';

export interface IClosingTimeDef {
    id?: number,
    closingDate?: string,
    closingTime: string,
    mediaId: number,
    mediaName?: string,
    page: number,
    editionId: number,
    editionName?: string
};

export class ClosingTimeDef {
    private _id: number;
    private _closingDate?: string;
    private _closingTime: string;
    private _mediaId: number;
    private _mediaName: string;
    private _page: number;
    private _editionId: number;
    private _editionName: string;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        if (dbdata.closing_date) this._closingDate = dbdata.closing_date;
        this._closingTime = dbdata.closing_time;
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        this._page = dbdata.page;
        this._editionId = parseInt(dbdata.edition_id, 10);
        this._editionName = dbdata.edition_name;
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
            const res = await client.query(
                'SELECT ' +
                ' C.id, C.closing_date, C.closing_time, C.media_id, C.page, C.edition_id, ' +
                ' M.name media_name, E.name edition_name ' +
                'FROM t_config_closing_time_def C ' + 
                'LEFT JOIN t_config_media_def M ON M.id = C.media_id ' +
                'LEFT JOIN t_config_edition_def E ON E.id = C.edition_id ' +
                'WHERE C.id=$1',
                [id]
            );
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
                'SELECT ' +
                ' C.id, C.closing_date, C.closing_time, C.media_id, C.page, C.edition_id, ' +
                ' M.name media_name, E.name edition_name ' +
                'FROM t_config_closing_time_def C ' + 
                'LEFT JOIN t_config_media_def M ON M.id = C.media_id ' +
                'LEFT JOIN t_config_edition_def E ON E.id = C.edition_id ' +
                'WHERE C.media_id=$1 ORDER BY C.media_id, C.id ',
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
    get mediaName() { return this._mediaName; }
    get page() { return this._page; }
    get editionId() { return this._editionId; }
    get editionName() { return this._editionName; }
    get data(): IClosingTimeDef {
        return {
            id: this.id,
            closingDate: this.closingDate,
            closingTime: this.closingTime,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            page: this.page,
            editionId: this.editionId,
            editionName: this.editionName
        };
    }

    set closingDate(closingDate) { this._closingDate = closingDate; }
    set closingTime(closingTime) { this._closingTime = closingTime; }
    set page(page) { this._page = page; }
    set editionId(editionId) { this._editionId = editionId; }
};