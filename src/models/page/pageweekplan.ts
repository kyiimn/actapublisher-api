import conn from '../../services/conn';
import { CodeClassDef } from '../code/codeclass';

export interface IPageWeekPlan {
    id?: number,
    mediaId: number,
    mediaName?: string,
    week: number,
    page: number,
    sectionId: number,
    sectionName?: string,
    sectionPage: number,
    colorType: string,
    colorTypeName?: string,
    pageSizeId: number,
    pageSizeName?: string,
    templateId: number,
    templateName?: string,
    userId: number,
    userName?: string,
    whole: boolean
}

export class PageWeekPlan {
    private _id?: number;
    private _mediaId: number;
    private _mediaName: string;
    private _week: number;
    private _page: number;
    private _sectionId: number;
    private _sectionName: string;
    private _sectionPage: number;
    private _colorType: string;
    private _colorTypeName: string;
    private _pageSizeId: number;
    private _pageSizeName: string;
    private _templateId: number;
    private _templateName: string;
    private _userId: number;
    private _userName: string;
    private _whole: boolean;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._mediaId = parseInt(dbdata.media_id);
        this._mediaName = dbdata.media_name;
        this._week = dbdata.week;
        this._page = dbdata.page;
        this._sectionId = parseInt(dbdata.section_id, 10);
        this._sectionName = dbdata.section_name;
        this._sectionPage = dbdata.section_page;
        this._colorType = dbdata.color_type;
        this._colorTypeName = dbdata.color_type_name;
        this._pageSizeId = parseInt(dbdata.page_size_id, 10);
        this._pageSizeName = dbdata.page_size_name;
        this._templateId = parseInt(dbdata.template_id, 10);
        this._templateName = dbdata.template_name;
        this._userId = parseInt(dbdata.user_id, 10);
        this._userName = dbdata.user_name;
        this._whole = dbdata.whole ? true : false;
    }

    get id() { return this._id; }
    get mediaId() { return this._mediaId; }
    get mediaName() { return this._mediaName; }
    get week() { return this._week; }
    get page() { return this._page; }
    get sectionId() { return this._sectionId; }
    get sectionName() { return this._sectionName; }
    get sectionPage() { return this._sectionPage; }
    get colorType() { return this._colorType; }
    get colorTypeName() { return this._colorTypeName; }
    get pageSizeId() { return this._pageSizeId; }
    get pageSizeName() { return this._pageSizeName; }
    get templateId() { return this._templateId; }
    get templateName() { return this._templateName; }
    get userId() { return this._userId; }
    get userName() { return this._userName; }
    get whole() { return this._whole; }
    get data(): IPageWeekPlan {
        return {
            id: this.id,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            week: this.week,
            page: this.page,
            sectionId: this.sectionId,
            sectionName: this.sectionName,
            sectionPage: this.sectionPage,
            colorType: this.colorType,
            colorTypeName: this.colorTypeName,
            pageSizeId: this.pageSizeId,
            pageSizeName: this.pageSizeName,
            templateId: this.templateId,
            templateName: this.templateName,
            userId: this.userId,
            userName: this.userName,
            whole: this.whole
        }
    }
    set sectionId(sectionId) { this._sectionId = sectionId; }
    set sectionPage(sectionPage) { this._sectionPage = sectionPage; }
    set colorType(colorType) { this._colorType = colorType; }
    set pageSizeId(pageSizeId) { this._pageSizeId = pageSizeId; }
    set templateId(templateId) { this._templateId = templateId; }
    set userId(userId) { this._userId = userId; }
    set whole(whole) { this._whole = whole; }

    static async create(data: IPageWeekPlan): Promise<PageWeekPlan | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'INSERT INTO t_page_week_plan (' +
                ' media_id, week, page, section_id, section_page, color_type, page_size_id, template_id, user_id, whole ' +
                ') VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',
                [
                    data.mediaId, data.week, data.page, data.sectionId, data.sectionPage, data.colorType,
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
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' W.id, W.media_id, W.week, W.page, W.section_id, W.section_page, W.color_type, W.page_size_id, W.template_id, W.user_id, W.whole, ' +
                ' M.name media_id, S.name section_name, C.name color_type_name, P.name page_size_name, T.name template_name, U.name user_name ' +
                'FROM t_page_week_plan W ' +
                'LEFT JOIN t_config_media_def M ON M.id = W.media_id ' +
                'LEFF JOIN t_config_section_def S ON S.id = W.section_id ' +
                'LEFT JOIN t_config_code_def C ON C.class=$1 AND C.code = W.color_type ' +
                'LEFT JOIN t_config_page_size_def P ON P.id = W.page_size_id ' +
                'LEFT JOIN t_page_template T ON T.id = W.template_id ' +
                'LEFT JOIN t_account_user U ON U.id = W.user_id ' +
                'WHERE W.id = $2 ',
                [CodeClassDef.CLASS_COLORTYPE, id]
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
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' W.id, W.media_id, W.week, W.page, W.section_id, W.section_page, W.color_type, W.page_size_id, W.template_id, W.user_id, W.whole, ' +
                ' M.name media_id, S.name section_name, C.name color_type_name, P.name page_size_name, T.name template_name, U.name user_name ' +
                'FROM t_page_week_plan W ' +
                'LEFT JOIN t_config_media_def M ON M.id = W.media_id ' +
                'LEFF JOIN t_config_section_def S ON S.id = W.section_id ' +
                'LEFT JOIN t_config_code_def C ON C.class=$1 AND C.code = W.color_type ' +
                'LEFT JOIN t_config_page_size_def P ON P.id = W.page_size_id ' +
                'LEFT JOIN t_page_template T ON T.id = W.template_id ' +
                'LEFT JOIN t_account_user U ON U.id = W.user_id ' +
                'WHERE W.media_id=$2 AND W.week=$3 ORDER BY W.page ',
                [CodeClassDef.CLASS_COLORTYPE, mediaId, week]
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
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'UPDATE t_page_week_plan SET ' +
                ' section_id=$1, section_page=$2, color_type=$3, page_size_id=$4, template_id=$5, user_id=$6, whole=$7 ' +
                'WHERE id=%8 ',
                [this.sectionId, this.sectionPage, this.colorType, this.pageSizeId, this.templateId, this.userId, this.whole, this.id]
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
        const client = await conn.getClient();
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