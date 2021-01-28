import conn from '../../services/conn';

export interface IPageWeekPlan {
    id?: number,
    mediaId: number,
    week: number,
    page: number,
    sectionId: number,
    sectionPage: number,
    colorId: number,
    pageSizeId: number,
    templateId: number,
    userId: number,
    whole: boolean
}

export class PageWeekPlan {
    private _id?: number;
    private _mediaId: number;
    private _week: number;
    private _page: number;
    private _sectionId: number;
    private _sectionPage: number;
    private _colorId: number;
    private _pageSizeId: number;
    private _templateId: number;
    private _userId: number;
    private _whole: boolean;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._mediaId = parseInt(dbdata.media_id);
        this._week = dbdata.week;
        this._page = dbdata.page;
        this._sectionId = parseInt(dbdata.section_id, 10);
        this._sectionPage = dbdata.section_page;
        this._colorId = parseInt(dbdata.color_id, 10);
        this._pageSizeId = parseInt(dbdata.page_size_id, 10);
        this._templateId = parseInt(dbdata.template_id, 10);
        this._userId = parseInt(dbdata.user_id, 10);
        this._whole = dbdata.whole ? true : false;
    }

    get id() { return this._id; }
    get mediaId() { return this._mediaId; }
    get week() { return this._week; }
    get page() { return this._page; }
    get sectionId() { return this._sectionId; }
    get sectionPage() { return this._sectionPage; }
    get colorId() { return this._colorId; }
    get pageSizeId() { return this._pageSizeId; }
    get templateId() { return this._templateId; }
    get userId() { return this._userId; }
    get whole() { return this._whole; }
    get data() {
        return {
            id: this.id,
            mediaId: this.mediaId,
            week: this.week,
            page: this.page,
            sectionId: this.sectionId,
            sectionPage: this.sectionPage,
            colorId: this.colorId,
            pageSizeId: this.pageSizeId,
            templateId: this.templateId,
            userId: this.userId,
            whole: this.whole
        }
    }
    set sectionId(sectionId) { this._sectionId = sectionId; }
    set sectionPage(sectionPage) { this._sectionPage = sectionPage; }
    set colorId(colorId) { this._colorId = colorId; }
    set pageSizeId(pageSizeId) { this._pageSizeId = pageSizeId; }
    set templateId(templateId) { this._templateId = templateId; }
    set userId(userId) { this._userId = userId; }
    set whole(whole) { this._whole = whole; }

    static async create(data: IPageWeekPlan): Promise<PageWeekPlan | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT INTO t_page_week_plan (' +
                ' media_id, week, page, section_id, section_page, color_id, page_size_id, template_id, user_id, whole ' +
                ') VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',
                [
                    data.mediaId, data.week, data.page, data.sectionId, data.sectionPage, data.colorId,
                    data.pageSizeId, data.templateId, data.userId, data.whole
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

    static async get(id: number): Promise<PageWeekPlan | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, media_id, week, page, section_id, section_page, color_id, page_size_id, template_id, user_id, whole ' +
                'FROM t_page_week_plan WHERE id=$1 ',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new PageWeekPlan(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByWeek(mediaId: number, week: number): Promise<PageWeekPlan[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, media_id, week, page, section_id, section_page, color_id, page_size_id, template_id, user_id, whole ' +
                'FROM t_page_week_plan WHERE media_id=$1 AND week=$2 ORDER BY page ',
                [mediaId, week]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PageWeekPlan(row));
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
                'UPDATE t_page_week_plan SET ' +
                ' section_id=$1, section_page=$2, color_id=$3, page_size_id=$4, template_id=$5, user_id=$6, whole=$7 ' +
                'WHERE id=%8 ',
                [this.sectionId, this.sectionPage, this.colorId, this.pageSizeId, this.templateId, this.userId, this.whole, this.id]
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
            const res = await client.query('DELETE FROM t_page_week_plan WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }
}