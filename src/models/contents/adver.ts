import IContent from './';
import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';
import { CodeClassDef } from '../code/codeclass';

export interface IAdverContent {
    id?: string,
    ver: number,
    title: string,
    description?: string,
    mediaId: number,
    mediaName?: string,
    deptId?: number,
    deptName?: string,
    userId?: number,
    userName?: string,
    regDate: string,
    pubDate: string,
    editionId: number,
    editionName?: string,
    page: number,
    adverSizeId: number,
    adverSizeName?: string,
    sendId?: string,
    sendDate?: string,
    sendUser?: string,
    source?: string,
    sourceName?: string,
    copyright?: string,
    copyrightName?: string,
    fixedType: boolean,
    adverType: string,
    adverTypeName?: string,
    status: string,
    statusName: string,
    fileStorageId: number,
    fileExtension: string,
    fileSize: number,
    colorId: number,
    colorName?: string,
    width: number,
    height: number,
    resolution: number
};

export class AdverContent extends IContent {
    private _id: string;
    private _ver: number;
    private _title: string;
    private _description?: string;
    private _mediaId: number;
    private _mediaName: string;
    private _deptId?: number;
    private _deptName?: string;
    private _userId?: number;
    private _userName?: string;
    private _regDate: string;
    private _pubDate: string;
    private _editionId: number;
    private _editionName: string;
    private _page: number;
    private _adverSizeId: number;
    private _adverSizeName: string;
    private _sendId?: string;
    private _sendDate?: string;
    private _sendUser?: string;
    private _source?: string;
    private _sourceName?: string;
    private _copyright?: string;
    private _copyrightName?: string;
    private _fixedType: boolean;
    private _adverType: string;
    private _adverTypeName: string;
    private _status: string;
    private _statusName: string;
    private _fileStorageId: number;
    private _fileExtension: string;
    private _fileSize: number;
    private _colorId: number;
    private _colorName: string;
    private _width: number;
    private _height: number;
    private _resolution: number;

    private constructor(dbdata: any) {
        super();

        this._id = dbdata.id;
        this._ver = dbdata.ver;
        this._title = dbdata.title;
        if (dbdata.description) this._description = dbdata.description;
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        if (dbdata.dept_id) this._deptId = parseInt(dbdata.dept_id, 10);
        if (dbdata.dept_name) this._deptName = dbdata.dept_name;
        if (dbdata.user_id) this._userId = parseInt(dbdata.user_id, 10);
        if (dbdata.user_name) this._userName = dbdata.user_name;
        this._regDate = dbdata.reg_date;
        this._pubDate = dbdata.pub_date;
        this._editionId = parseInt(dbdata.edition_id, 10);
        this._editionName = dbdata.editionName;
        this._page = dbdata.page;
        this._adverSizeId = parseInt(dbdata.adver_size_id, 10);
        this._adverSizeName = dbdata.adver_size_name;
        if (dbdata.send_id) this._sendId = dbdata.send_id;
        if (dbdata.send_date) this._sendDate = dbdata.send_date;
        if (dbdata.send_user) this._sendUser = dbdata.send_user;
        if (dbdata.source) this._source = dbdata.source;
        if (dbdata.source_name) this._sourceName = dbdata.source_name;
        if (dbdata.copyright) this._copyright = dbdata.copyright;
        if (dbdata.copyright_name) this._copyrightName = dbdata.copyright_name;
        this._fixedType = dbdata.fixed_type ? true : false;
        this._adverType = dbdata.adver_type;
        this._adverTypeName = dbdata.adver_type_name;
        this._status = dbdata.status;
        this._statusName = dbdata.status_name;
        this._fileStorageId = parseInt(dbdata.file_storage_id, 10);
        this._fileExtension = dbdata.file_extension;
        this._fileSize = dbdata.file_size;
        this._colorId = parseInt(dbdata.color_id, 10);
        this._colorName = dbdata.color_name;
        this._width = dbdata.width;
        this._height = dbdata.height;
        this._resolution = dbdata.resolution;
    }

    static async create(data: IAdverContent): Promise<AdverContent | null> {
        const client = await conn.getClient();
        try {
            const newId = await this.generateId();
            if (!newId) return null;

            const res = await client.query(
                'INSERT t_adver (' +
                ' id, ver, title, description, media_id, dept_id, user_id, ' +
                ' reg_date, pub_date, edition_id, page, adver_size_id, ' +
                ' send_id, send_date, send_user, source, copyright, ' +
                ' fixed_type, adver_type, status, ' +
                ' file_storage_id, file_extension, file_size, ' +
                ' color_id, width, height, resolution, lock ' +
                ') VALUES (' +
                ' $1,$2,$3,$4,$5,$6,$7,' +
                ' now(),$8,$9,$10,$11,' +
                ' $12,TO_TIMESTAMP($13,\'YYYYMMDDHH24MISS\'),$14,$15,$16,' +
                ' $17,$18,$19,' +
                ' $20,$21,$22,' +
                ' $23,$24,$25,$26,$27) RETURNING id',
                [
                    newId, 0, data.title, data.description || null, data.mediaId, data.deptId || null, data.userId || null,
                    data.pubDate, data.editionId, data.page, data.adverSizeId,
                    data.sendId || null, data.sendDate || null, data.sendUser || null, data.source || null, data.copyright || null,
                    data.fixedType ? 1 : 0, data.adverType, data.status,
                    data.fileStorageId, data.fileExtension, data.fileSize,
                    data.colorId, data.width, data.height, data.resolution, 0
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

    static async get(id: string): Promise<AdverContent | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.ver, A.title, A.description, A.media_id, A.dept_id, A.user_id, ' +
                ' TO_CHAR(A.reg_date, \'YYYYMMDDHH24MMISS\') reg_date, A.pub_date, A.edition_id, A.page, A.adver_size_id, ' +
                ' A.send_id, TO_CHAR(A.send_date, \'YYYYMMDDHH24MMISS\') send_date, A.send_user, A.source, A.copyright, ' +
                ' A.fixed_type, A.adver_type, A.status, ' +
                ' A.file_storage_id, A.file_extension, A.file_size, ' +
                ' A.color_id, A.width, A.height, A.resolution, ' +
                ' M.name media_name, D.name dept_name, U.name user_name, E.name edition_name, S.name adver_size_name, ' +
                ' C1.name source_name, C2.name copyright_name, C3.name adver_type_name, C4.name status_name, ' +
                ' C.name color_name ' +
                'FROM t_adver A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'LEFT JOIN t_account_dept D ON D.id = A.dept_id ' +
                'LEFT JOIN t_account_user U ON U.id = A.user_id ' +
                'LEFT JOIN t_config_edition_def E ON E.id = A.edition_id ' +
                'LEFT JOIN t_config_adver_size_def S ON S.id = A.adver_size_id ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code = A.source ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code = A.copyright ' +
                'LEFT JOIN t_config_code_def C3 ON C3.class=$3 AND C3.code = A.adver_type ' +
                'LEFT JOIN t_config_code_def C4 ON C4.class=$4 AND C4.code = A.status ' +
                'LEFT JOIN t_config_color_def C ON C.id = A.color_id ' +
                'WHERE A.id = $5',
                [CodeClassDef.CLASS_SOURCE, CodeClassDef.CLASS_COPYRIGHT, CodeClassDef.CLASS_ADVERTYPE, CodeClassDef.CLASS_ADVERSTATUS, id]
            );
            if (res.rowCount < 1) return null;
            return new AdverContent(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<AdverContent[] | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.ver, A.title, A.description, A.media_id, A.dept_id, A.user_id, ' +
                ' TO_CHAR(A.reg_date, \'YYYYMMDDHH24MMISS\') reg_date, A.pub_date, A.edition_id, A.page, A.adver_size_id, ' +
                ' A.send_id, TO_CHAR(A.send_date, \'YYYYMMDDHH24MMISS\') send_date, A.send_user, A.source, A.copyright, ' +
                ' A.fixed_type, A.adver_type, A.status, ' +
                ' A.file_storage_id, A.file_extension, A.file_size, ' +
                ' A.color_id, A.width, A.height, A.resolution, ' +
                ' M.name media_name, D.name dept_name, U.name user_name, E.name edition_name, S.name adver_size_name, ' +
                ' C1.name source_name, C2.name copyright_name, C3.name adver_type_name, C4.name status_name, ' +
                ' C.name color_name ' +
                'FROM t_adver A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'LEFT JOIN t_account_dept D ON D.id = A.dept_id ' +
                'LEFT JOIN t_account_user U ON U.id = A.user_id ' +
                'LEFT JOIN t_config_edition_def E ON E.id = A.edition_id ' +
                'LEFT JOIN t_config_adver_size_def S ON S.id = A.adver_size_id ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code = A.source ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code = A.copyright ' +
                'LEFT JOIN t_config_code_def C3 ON C3.class=$3 AND C3.code = A.adver_type ' +
                'LEFT JOIN t_config_code_def C4 ON C4.class=$4 AND C4.code = A.status ' +
                'LEFT JOIN t_config_color_def C ON C.id = A.color_id ' +
                'FROM t_adver A ORDER BY A.id ',
                [CodeClassDef.CLASS_SOURCE, CodeClassDef.CLASS_COPYRIGHT, CodeClassDef.CLASS_ADVERTYPE, CodeClassDef.CLASS_ADVERSTATUS]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new AdverContent(row));
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
                'UPDATE t_adver SET ver=ver+1, ' +
                ' title=$1, description=$2, ' +
                ' pub_date=$3, edition_id=$4, page=$5, adver_size_id=$6, ' +
                ' source=$7, copyright=$8, ' +
                ' fixed_type=$9, adver_type=$10, status=$11 ' +
                'WHERE id=$12 AND lock=1 RETURNING ver',
                [
                    this.title, this.description || null,
                    this.pubDate, this.editionId, this.page, this.adverSizeId,
                    this.source || null, this.copyright || null,
                    this.fixedType ? 1 : 0, this.adverType, this.status,
                    this.id
                ]
            );
            if (res.rowCount < 1) return null;
            this._ver = res.rows[0].ver;

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
            const res = await client.query('DELETE FROM t_adver WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async setLock(userId: number): Promise<boolean> {
        if (await this.isLock()) return false;

        const client = await conn.getClient();
        try {
            const res = await client.query('UPDATE t_adver SET lock=1, lock_date=now(), lock_user_id=$1 WHERE id=$2', [userId, this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async getLock(): Promise<ILockInfo | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query('SELECT ' +
                ' C.lock lock, TO_CHAR(C.lock_date, \'YYYYMMDDHH24MMISS\') lock_date, ' +
                ' C.lock_user_id lock_user_id, U.name lock_user_name ' +
                'FROM t_adver C LEFT JOIN t_account_user U ON C.lock_user_id=U.id ' +
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

        const client = await conn.getClient();
        try {
            let res;
            if (userId) {
                res = await client.query('UPDATE t_adver SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 AND lock_user_id=$4', [null, null, this.id, userId]);
            } else {
                res = await client.query('UPDATE t_adver SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 ', [null, null, this.id]);
            }
            return res.rowCount > 0 ? true : false;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async isLock(userId?: number): Promise<boolean> {
        const client = await conn.getClient();
        try {
            let res;
            if (userId) {
                res = await client.query('SELECT count(*) cnt FROM t_adver WHERE id=$1 AND lock_user_id=$2 AND lock=1', [this.id, userId]);
            } else {
                res = await client.query('SELECT count(*) cnt FROM t_adver WHERE id=$1 AND lock=1', [this.id]);
            }
            return (res.rowCount > 0) ? true : false;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get ver() { return this._ver; }
    get title() { return this._title; }
    get description() { return this._description; }
    get mediaId() { return this._mediaId; }
    get mediaName() { return this._mediaName; }
    get deptId() { return this._deptId; }
    get deptName() { return this._deptName; }
    get userId() { return this._userId; }
    get userName() { return this._userName; }
    get regDate() { return this._regDate; }
    get pubDate() { return this._pubDate; }
    get editionId() { return this._editionId; }
    get editionName() { return this._editionName; }
    get page() { return this._page; }
    get adverSizeId() { return this._adverSizeId; }
    get adverSizeName() { return this._adverSizeName; }
    get sendId() { return this._sendId; }
    get sendDate() { return this._sendDate; }
    get sendUser() { return this._sendUser; }
    get source() { return this._source; }
    get sourceName() { return this._sourceName; }
    get copyright() { return this._copyright; }
    get copyrightName() { return this._copyrightName; }
    get fixedType() { return this._fixedType; }
    get adverType() { return this._adverType; }
    get adverTypeName() { return this._adverTypeName; }
    get status() { return this._status; }
    get statusName() { return this._statusName; }
    get fileStorageId() { return this._fileStorageId; }
    get fileExtension() { return this._fileExtension; }
    get fileSize() { return this._fileSize; }
    get colorId() { return this._colorId; }
    get colorName() { return this._colorName; }
    get width() { return this._width; }
    get height() { return this._height; }
    get resolution() { return this._resolution; }
    get data(): IAdverContent {
        return {
            id: this.id,
            ver: this.ver,
            title: this.title,
            description: this.description,
            mediaId: this.mediaId,
            mediaName: this._mediaName,
            deptId: this.deptId,
            deptName: this.deptName,
            userId: this.userId,
            userName: this.userName,
            regDate: this.regDate,
            pubDate: this.pubDate,
            editionId: this.editionId,
            editionName: this.editionName,
            page: this.page,
            adverSizeId: this.adverSizeId,
            adverSizeName: this.adverSizeName,
            sendId: this.sendId,
            sendDate: this.sendDate,
            sendUser: this.sendUser,
            source: this.source,
            sourceName: this.sourceName,
            copyright: this.copyright,
            copyrightName: this.copyrightName,
            fixedType: this.fixedType,
            adverType: this.adverType,
            adverTypeName: this.adverTypeName,
            status: this.status,
            statusName: this.statusName,
            fileStorageId: this.fileStorageId,
            fileExtension: this.fileExtension,
            fileSize: this.fileSize,
            colorId: this.colorId,
            colorName: this.colorName,
            width: this.width,
            height: this.height,
            resolution: this.resolution
        };
    }
    set title(title) { this._title = title; }
    set description(description) { this._description = description; }
    set pubDate(pubDate) { this._pubDate = pubDate; }
    set editionId(editionId) { this._editionId = editionId; }
    set page(page) { this._page = page; }
    set adverSizeId(adverSizeId) { this._adverSizeId = adverSizeId; }
    set source(source) { this._source = source; }
    set copyright(copyright) { this._copyright = copyright; }
    set fixedType(fixedType) { this._fixedType = fixedType; }
    set adverType(adverType) { this._adverType = adverType; }
    set status(status) { this._status = status; }
};