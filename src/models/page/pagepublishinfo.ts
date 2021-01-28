import conn from '../../services/conn';

export interface IPagePublishInfo {
    id?: number,
    mediaId: number,
    mediaName?: string,
    pubDate: string,
    page: number,
    sectionId: number,
    sectionName?: string,
    sectionPage: number,
    colorId: number,
    colorName?: string,
    pageSizeId: number,
    pageSizeName?: string,
    whole: boolean
}

export class PagePublishInfo {
    private _id?: number;
    private _mediaId: number;
    private _mediaName: string;
    private _pubDate: string;
    private _page: number;
    private _sectionId: number;
    private _sectionName: string;
    private _sectionPage: number;
    private _colorId: number;
    private _colorName: string;
    private _pageSizeId: number;
    private _pageSizeName: string;
    private _whole: boolean;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._mediaId = parseInt(dbdata.media_id);
        this._mediaName = dbdata.media_name;
        this._pubDate = dbdata.pub_date;
        this._page = dbdata.page;
        this._sectionId = parseInt(dbdata.section_id, 10);
        this._sectionName = dbdata.section_name;
        this._sectionPage = dbdata.section_page;
        this._colorId = parseInt(dbdata.color_id, 10);
        this._colorName = dbdata.color_name;
        this._pageSizeId = parseInt(dbdata.page_size_id, 10);
        this._pageSizeName = dbdata.page_size_name;
        this._whole = dbdata.whole ? true : false;
    }

    get id() { return this._id; }
    get mediaId() { return this._mediaId; }
    get mediaName() { return this._mediaName; }
    get pubDate() { return this._pubDate; }
    get page() { return this._page; }
    get sectionId() { return this._sectionId; }
    get sectionName() { return this._sectionName; }
    get sectionPage() { return this._sectionPage; }
    get colorId() { return this._colorId; }
    get colorName() { return this._colorName; }
    get pageSizeId() { return this._pageSizeId; }
    get pageSizeName() { return this._pageSizeName; }
    get whole() { return this._whole; }
    get data(): IPagePublishInfo {
        return {
            id: this.id,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            pubDate: this.pubDate,
            page: this.page,
            sectionId: this.sectionId,
            sectionName: this.sectionName,
            sectionPage: this.sectionPage,
            colorId: this.colorId,
            colorName: this.colorName,
            pageSizeId: this.pageSizeId,
            pageSizeName: this.pageSizeName,
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
                ' I.id, I.media_id, I.pub_date, I.page, I.section_id, I.section_page, I.color_id, I.page_size_id, I.whole, ' +
                ' M.name media_name, S.name section_name, C.name color_name, P.name page_size_name ' +
                'FROM t_page_publish_info I ' +
                'LEFT JOIN t_config_media_def M ON M.id = I.media_id ' +
                'LEFT JOIN t_config_section_def S ON S.id = I.section_id ' +
                'LEFT JOIN t_config_color_def C ON C.id = I.color_id ' +
                'LEFT JOIN t_config_page_size_def P ON P.id = I.page_size_id ' +
                'WHERE I.id = $1 ',
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
                ' I.id, I.media_id, I.pub_date, I.page, I.section_id, I.section_page, I.color_id, I.page_size_id, I.whole, ' +
                ' M.name media_name, S.name section_name, C.name color_name, P.name page_size_name ' +
                'FROM t_page_publish_info I ' +
                'LEFT JOIN t_config_media_def M ON M.id = I.media_id ' +
                'LEFT JOIN t_config_section_def S ON S.id = I.section_id ' +
                'LEFT JOIN t_config_color_def C ON C.id = I.color_id ' +
                'LEFT JOIN t_config_page_size_def P ON P.id = I.page_size_id ' +
                'WHERE I.media_id=$1 AND I.pub_date=$2 ORDER BY I.page ',
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