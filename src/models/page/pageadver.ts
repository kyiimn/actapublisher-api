import IPage from '.';
import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';
import { CodeClassDef } from '../code/codeclass';

export interface IPageAdver {
    id?: string,
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
    adverLocalId: number,
    adverLocalName?: string,
    adverSizeId: number,
    adverSizeName?: string,
    userId: number,
    userName?: string,
    fileStorageId: number,
    status: string,
    statusName?: string
}

export class PageAdver extends IPage {
    private _id: string;
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
    private _adverLocalId: number;
    private _adverLocalName: string;
    private _adverSizeId: number;
    private _adverSizeName: string;
    private _userId: number;
    private _userName: string;
    private _fileStorageId: number;
    private _status: string;
    private _statusName: string;

    private constructor(dbdata: any) {
        super();

        this._id = dbdata.id;
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
        this._adverLocalId = parseInt(dbdata.adver_local_id, 10);
        this._adverLocalName = dbdata.adver_local_name;
        this._adverSizeId = parseInt(dbdata.adver_size_id, 10);
        this._adverSizeName = dbdata.adver_size_name;
        this._userId = parseInt(dbdata.user_id, 10);
        this._userName = dbdata.user_name;
        this._fileStorageId = parseInt(dbdata.file_storage_id, 10);
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
    get adverLocalId() { return this._adverLocalId; }
    get adverLocalName() { return this._adverLocalName; }
    get adverSizeId() { return this._adverSizeId; }
    get adverSizeName() { return this._adverSizeName; }
    get userId() { return this._userId; }
    get userName() { return this._userName; }
    get fileStorageId() { return this._fileStorageId; }
    get status() { return this._status; }
    get statusName() { return this._statusName; }
    get data(): IPageAdver {
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
            adverLocalId: this.adverLocalId,
            adverLocalName: this.adverLocalName,
            adverSizeId: this.adverSizeId,
            adverSizeName: this.adverSizeName,
            userId: this.userId,
            userName: this.userName,
            fileStorageId: this.fileStorageId,
            status: this.status,
            statusName: this.statusName
        };
    }
    set adverSizeId(adverSizeId) { this._adverSizeId = adverSizeId; }
    set status(status) { this._status = status; }

    static async create(data: IPageAdver): Promise<PageAdver | null> {
        const client = await conn.in.getClient();
        try {
            const newId = await this.generateId();
            if (!newId) return null;

            const res = await client.query(
                'INSERT t_page_adver (' +
                ' id, publish_id, edition_id, adver_local_id, adver_size_id, user_id, file_storage_id, status ' +
                ') VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
                [
                    newId, data.publishId, data.editionId, data.adverLocalId, data.adverSizeId, data.userId, data.fileStorageId, data.status
                ]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: string): Promise<PageAdver | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' P.id, P.publish_id, P.edition_id, P.adver_local_id, P.adver_size_id, P.user_id, P.file_storage_id, P.status, ' +
                ' PU.media_id, PU.pub_date, PU.page, PU.section_id, PU.section_page, PU.color_id, PU.page_size_id, PU.whole, ' +
                ' ME.name media_name, SE.name section_name, CO.name color_name, PS.name page_size_name, ' +
                ' ED.name edition_name, A1.name adver_local_name, A2.name adver_size_name, US.name user_name, CC.name status_name ' +
                'FROM t_page_adver P ' +
                'LEFT JOIN t_page_publish_info PU ON PU.id = P.publish_id ' +
                'LEFT JOIN t_config_media_def ME ON ME.id = PU.media_id ' +
                'LEFT JOIN t_config_section_def SE ON SE.id = PU.section_id ' +
                'LEFT JOIN t_config_color_def CO ON CO.id = PU.color_id ' +
                'LEFT JOIN t_config_page_size_def PS ON PS.id = PU.page_size_id ' +
                'LEFT JOIN t_config_edition_def ED ON ED.id = P.edition_id ' +
                'LEFT JOIN t_config_adver_local_def A1 ON A1.id = P.adver_local_id ' +
                'LEFT JOIN t_config_adver_size_def A2 ON A2.id = P.adver_size_id ' +
                'LEFT JOIN t_account_user US ON US.id = P.user_id ' +
                'LEFT JOIN t_config_code_def CC ON CC.class=$1 AND CC.code = P.status ' +
                'WHERE P.id = $2 ',
                [CodeClassDef.CLASS_PAGEADVERSTATUS, id]
            );
            if (res.rowCount < 1) return null;
            return new PageAdver(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByPubInfo(publishId: number): Promise<PageAdver[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' P.id, P.publish_id, P.edition_id, P.adver_local_id, P.adver_size_id, P.user_id, P.file_storage_id, P.status, ' +
                ' PU.media_id, PU.pub_date, PU.page, PU.section_id, PU.section_page, PU.color_id, PU.page_size_id, PU.whole, ' +
                ' ME.name media_name, SE.name section_name, CO.name color_name, PS.name page_size_name, ' +
                ' ED.name edition_name, A1.name adver_local_name, A2.name adver_size_name, US.name user_name, CC.name status_name ' +
                'FROM t_page_adver P ' +
                'LEFT JOIN t_page_publish_info PU ON PU.id = P.publish_id ' +
                'LEFT JOIN t_config_media_def ME ON ME.id = PU.media_id ' +
                'LEFT JOIN t_config_section_def SE ON SE.id = PU.section_id ' +
                'LEFT JOIN t_config_color_def CO ON CO.id = PU.color_id ' +
                'LEFT JOIN t_config_page_size_def PS ON PS.id = PU.page_size_id ' +
                'LEFT JOIN t_config_edition_def ED ON ED.id = P.edition_id ' +
                'LEFT JOIN t_config_adver_local_def A1 ON LO.id = P.adver_local_id ' +
                'LEFT JOIN t_config_adver_size_def A2 ON LO.id = P.adver_size_id ' +
                'LEFT JOIN t_account_user US ON US.id = P.user_id ' +
                'LEFT JOIN t_config_code_def CC ON CC.class=$1 AND CC.code = P.status ' +
                'WHERE P.publish_id=$1 ORDER BY P.edition_id ',
                [CodeClassDef.CLASS_PAGEADVERSTATUS, publishId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PageAdver(row));
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
                'UPDATE t_page_adver SET adver_size_id=$1, status=$2 WHERE id=$3 AND lock=1 ',
                [this.adverSizeId, this.status, this.id]
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
            const res = await client.query('DELETE FROM t_page_adver WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async setLock(userId: number): Promise<boolean> {
        if (await this.isLock()) return false;

        const client = await conn.in.getClient();
        try {
            const res = await client.query('UPDATE t_page_adver SET lock=1, lock_date=now(), lock_user_id=$1 WHERE id=$2', [userId, this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async getLock(): Promise<ILockInfo | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT ' +
                ' C.lock lock, TO_CHAR(C.lock_date, \'YYYYMMDDHH24MMISS\') lock_date, ' +
                ' C.lock_user_id lock_user_id, U.name lock_user_name ' +
                'FROM t_page_adver C LEFT JOIN t_account_user U ON C.lock_user_id=U.id ' +
                'WHERE C.id=$1 ',
                [this.id]
            );
            if (res.rowCount < 1) return null;
            return {
                lockDate: res.rows[0].lockDate,
                lockUserId: parseInt(res.rows[0].lock_user_id, 10),
                lockUserName: res.rows[0].lock_user_name
            }
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    async releaseLock(userId?: number): Promise<boolean> {
        if (await this.isLock(userId)) return false;

        const client = await conn.in.getClient();
        try {
            let res;
            if (userId) {
                res = await client.query('UPDATE t_page_adver SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 AND lock_user_id=$4', [null, null, this.id, userId]);
            } else {
                res = await client.query('UPDATE t_page_adver SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 ', [null, null, this.id]);
            }
            return res.rowCount > 0 ? true : false;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async isLock(userId?: number): Promise<boolean> {
        const client = await conn.in.getClient();
        try {
            let res;
            if (userId) {
                res = await client.query('SELECT count(*) cnt FROM t_page_adver WHERE id=$1 AND lock_user_id=$2 AND lock=1', [this.id, userId]);
            } else {
                res = await client.query('SELECT count(*) cnt FROM t_page_adver WHERE id=$1 AND lock=1', [this.id]);
            }
            return (res.rowCount > 0) ? true : false;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }
}
