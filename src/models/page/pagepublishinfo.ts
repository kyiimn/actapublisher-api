import conn from '../../services/conn';

export interface IPagePublishInfo {
    id?: number,
    mediaId: number,
    pubDate: string,
    page: number,
    sectionId: number,
    sectionPage: number,
    colorId: number,
    pageSizeId: number,
    whole: boolean
}

export class PagePublishInfo {
    private _id?: number;
    private _mediaId: number;
    private _pubDate: string;
    private _page: number;
    private _sectionId: number;
    private _sectionPage: number;
    private _colorId: number;
    private _pageSizeId: number;
    private _whole: boolean;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._mediaId = parseInt(dbdata.media_id);
        this._pubDate = dbdata.pub_date;
        this._page = dbdata.page;
        this._sectionId = parseInt(dbdata.section_id, 10);
        this._sectionPage = dbdata.section_page;
        this._colorId = parseInt(dbdata.color_id, 10);
        this._pageSizeId = parseInt(dbdata.page_size_id, 10);
        this._whole = dbdata.whole ? true : false;
    }

    get id() { return this._id; }
    get mediaId() { return this._mediaId; }
    get pubDate() { return this._pubDate; }
    get page() { return this._page; }
    get sectionId() { return this._sectionId; }
    get sectionPage() { return this._sectionPage; }
    get colorId() { return this._colorId; }
    get pageSizeId() { return this._pageSizeId; }
    get whole() { return this._whole; }
    get data() {
        return {
            id: this.id,
            mediaId: this.mediaId,
            pubDate: this.pubDate,
            page: this.page,
            sectionId: this.sectionId,
            sectionPage: this.sectionPage,
            colorId: this.colorId,
            pageSizeId: this.pageSizeId,
            whole: this.whole
        }
    }
    set sectionId(sectionId) { this._sectionId = sectionId; }
    set sectionPage(sectionPage) { this._sectionPage = sectionPage; }
    set colorId(colorId) { this._colorId = colorId; }
    set pageSizeId(pageSizeId) { this._pageSizeId = pageSizeId; }
    set whole(whole) { this._whole = whole; }

    static async create(data: IPagePublishInfo): Promise<PagePublishInfo | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT INTO t_page_publish_info (' +
                ' media_id, pub_date, page, section_id, section_page, color_id, page_size_id, whole ' +
                ') VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
                [
                    data.mediaId, data.pubDate, data.page, data.sectionId, data.sectionPage, data.colorId,
                    data.pageSizeId, data.whole
                ]
            );
            if (res.rowCount < 1) return null;
            return this.get(res.rows[0].id);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<PagePublishInfo | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, media_id, pub_date, page, section_id, section_page, color_id, page_size_id, whole ' +
                'FROM t_page_publish_info WHERE id=$1 ',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new PagePublishInfo(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByPubInfo(mediaId: number, pubDate: string): Promise<PagePublishInfo[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, media_id, pub_date, page, section_id, section_page, color_id, page_size_id, whole ' +
                'FROM t_page_publish_info WHERE media_id=$1 AND pub_date=$2 ORDER BY page ',
                [mediaId, pubDate]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PagePublishInfo(row));
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
                'UPDATE t_page_publish_info SET ' +
                ' section_id=$1, section_page=$2, color_id=$3, page_size_id=$4, whole=$5 ' +
                'WHERE id=%6 ',
                [this.sectionId, this.sectionPage, this.colorId, this.pageSizeId, this.whole, this.id]
            );
            if (res.rowCount < 1) return null;
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
            const res = await client.query('DELETE FROM t_page_publish_info WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }
}