import conn from '../../services/conn';
import { CodeClassDef } from '../code/codeclass';

export interface IPagePrint {
    id?: number,
    publishId: number,
    mediaId?: number,
    mediaName?: string,
    pubDate?: string,
    page?: number,
    sectionId?: number,
    sectionName?: string,
    sectionPage?: number,
    colorId?: number,
    colorName?: string,
    pageSizeId?: number,
    pageSizeName?: string,
    whole?: boolean
    editionId: number,
    editionName?: string,
    localId: number,
    localName?: string,
    adverLocalId: number,
    adverLocalName?: string,
    printTypeId: number,
    printTypeName?: string,
    status: string,
    statusName?: string
}

export class PagePrint {
    private _id: number;
    private _publishId: number;
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
    private _editionId: number;
    private _editionName: string;
    private _localId: number;
    private _localName: string;
    private _adverLocalId: number;
    private _adverLocalName: string;
    private _printTypeId: number;
    private _printTypeName: string;
    private _status: string;
    private _statusName: string;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._publishId = parseInt(dbdata.publish_id, 10);
        this._mediaId = parseInt(dbdata.media_id, 10);
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
        this._editionId = parseInt(dbdata.edition_id, 10);
        this._editionName = dbdata.edition_name;
        this._localId = parseInt(dbdata.local_id, 10);
        this._localName = dbdata.local_name;
        this._adverLocalId = parseInt(dbdata.adver_local_id, 10);
        this._adverLocalName = dbdata.adver_local_name;
        this._printTypeId = parseInt(dbdata.print_type_id, 10);
        this._printTypeName = dbdata.print_type_name;
        this._status = dbdata.status;
        this._statusName = dbdata.status_name;
    }

    get id() { return this._id; }
    get publishId() { return this._publishId; }
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
    get whole() { return this._whole; };
    get editionId() { return this._editionId; }
    get editionName() { return this._editionName; }
    get localId() { return this._localId; }
    get localName() { return this._localName; }
    get adverLocalId() { return this._adverLocalId; }
    get adverLocalName() { return this._adverLocalName; }
    get printTypeId() { return this._printTypeId; }
    get printTypeName() { return this._printTypeName; }
    get status() { return this._status; }
    get statusName() { return this._statusName; }
    get data(): IPagePrint {
        return {
            id: this.id,
            publishId: this.publishId,
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
            whole: this.whole,
            editionId: this.editionId,
            editionName: this.editionName,
            localId: this.localId,
            localName: this.localName,
            adverLocalId: this.adverLocalId,
            adverLocalName: this.adverLocalName,
            printTypeId: this.printTypeId,
            printTypeName: this.printTypeName,
            status: this.status,
            statusName: this.statusName
        };
    }

    set status(status) { this._status = status; }

    static async create(data: IPagePrint): Promise<PagePrint | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'INSERT t_page_print (publish_id, edition_id, local_id, adver_local_id, print_type_id, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id ',
                [data.publishId, data.editionId, data.localId, data.adverLocalId, data.printTypeId, data.status]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<PagePrint | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' P.id, P.publish_id, P.edition_id, P.local_id, P.adver_local_id, P.print_type_id, P.status, ' +
                ' PU.media_id, PU.pub_date, PU.page, PU.section_id, PU.section_page, PU.color_id, PU.page_size_id, PU.whole, ' +
                ' ME.name media_name, SE.name section_name, CO.name color_name, PS.name page_size_name, ' +
                ' ED.name edition_name, LO.name local_name, A.name adver_local_name, PT.name print_type_name, CC.name status_name ' +
                'FROM t_page_print P ' +
                'LEFT JOIN t_page_publish_info PU ON PU.id = P.publish_id ' +
                'LEFT JOIN t_config_media_def ME ON ME.id = PU.media_id ' +
                'LEFT JOIN t_config_section_def SE ON SE.id = PU.section_id ' +
                'LEFT JOIN t_config_color_def CO ON CO.id = PU.color_id ' +
                'LEFT JOIN t_config_page_size_def PS ON PS.id = PU.page_size_id ' +
                'LEFT JOIN t_config_edition_def ED ON ED.id = P.edition_id ' +
                'LEFT JOIN t_config_local_def LO ON LO.id = P.local_id ' +
                'LEFT JOIN t_config_adver_local_def A ON A.id = P.adver_local_id ' +
                'LEFT JOIN t_config_print_type_def PT ON PT.id = P.print_type_id ' +
                'LEFT JOIN t_config_code_def CC ON CC.class=$1 AND CC.code = P.status ' +
                'WHERE P.id=$2 ',
                [CodeClassDef.CLASS_PAGEPRINTSTATUS, id]
            );
            if (res.rowCount < 1) return null;
            return new PagePrint(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }
    static async selectByPubInfo(publishId: number): Promise<PagePrint[] | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' P.id, P.publish_id, P.edition_id, P.local_id, P.adver_local_id, P.print_type_id, P.status, ' +
                ' PU.media_id, PU.pub_date, PU.page, PU.section_id, PU.section_page, PU.color_id, PU.page_size_id, PU.whole, ' +
                ' ME.name media_name, SE.name section_name, CO.name color_name, PS.name page_size_name, ' +
                ' ED.name edition_name, LO.name local_name, A.name adver_local_name, PT.name print_type_name, CC.name status_name ' +
                'FROM t_page_print P ' +
                'LEFT JOIN t_page_publish_info PU ON PU.id = P.publish_id ' +
                'LEFT JOIN t_config_media_def ME ON ME.id = PU.media_id ' +
                'LEFT JOIN t_config_section_def SE ON SE.id = PU.section_id ' +
                'LEFT JOIN t_config_color_def CO ON CO.id = PU.color_id ' +
                'LEFT JOIN t_config_page_size_def PS ON PS.id = PU.page_size_id ' +
                'LEFT JOIN t_config_edition_def ED ON ED.id = P.edition_id ' +
                'LEFT JOIN t_config_local_def LO ON LO.id = P.local_id ' +
                'LEFT JOIN t_config_adver_local_def A ON A.id = P.adver_local_id ' +
                'LEFT JOIN t_config_print_type_def PT ON PT.id = P.print_type_id ' +
                'LEFT JOIN t_config_code_def CC ON CC.class=$1 AND CC.code = P.status ' +
                'WHERE P.publish_id=$2 ' +
                'ORDER BY P.publish_id, P.edition_id, P.local_id, P.adver_local_id DESC ',
                [CodeClassDef.CLASS_PAGEPRINTSTATUS, publishId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PagePrint(row));
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
                'UPDATE t_page_print SET status=$1 WHERE id=$2',
                [this.status, this.id]
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
            const res = await client.query('DELETE FROM t_page_print WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }
}