import IContent from './';
import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';

export interface IImageContent {
    id?: string,
    ver: number,
    title: string,
    description?: string,
    mediaId: number,
    deptId?: number,
    userId?: number,
    regDate: string,
    pubDate: string,
    editionId: number,
    page: number,
    sendId?: string,
    sendDate?: string,
    sendUser?: string,
    source?: string,
    copyright?: string,
    fixedType: number,
    imageType: string,
    status: string,
    fileStorageId: number,
    fileExtension: string,
    fileSize: number,
    colorId: number,
    width: number,
    height: number,
    resolution: number
};

export class ImageContent extends IContent {
    private _id: string;
    private _ver: number;
    private _title: string;
    private _description?: string;
    private _mediaId: number;
    private _deptId?: number;
    private _userId?: number;
    private _regDate: string;
    private _pubDate: string;
    private _editionId: number;
    private _page: number;
    private _sendId?: string;
    private _sendDate?: string;
    private _sendUser?: string;
    private _source?: string;
    private _copyright?: string;
    private _fixedType: number;
    private _imageType: string;
    private _status: string;
    private _fileStorageId: number;
    private _fileExtension: string;
    private _fileSize: number;
    private _colorId: number;
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
        if (dbdata.dept_id) this._deptId = parseInt(dbdata.dept_id, 10);
        if (dbdata.user_id) this._userId = parseInt(dbdata.user_id, 10);
        this._regDate = dbdata.reg_date;
        this._pubDate = dbdata.pub_date;
        this._editionId = parseInt(dbdata.edition_id, 10);
        this._page = dbdata.page;
        if (dbdata.send_id) this._sendId = dbdata.send_id;
        if (dbdata.send_date) this._sendDate = dbdata.send_date;
        if (dbdata.send_user) this._sendUser = dbdata.send_user;
        if (dbdata.source) this._source = dbdata.source;
        if (dbdata.copyright) this._copyright = dbdata.copyright;
        this._fixedType = dbdata.fixed_type;
        this._imageType = dbdata.image_type;
        this._status = dbdata.status;
        this._fileStorageId = dbdata.file_storage_id;
        this._fileExtension = dbdata.file_extension;
        this._fileSize = dbdata.file_size;
        this._colorId = parseInt(dbdata.color_id, 10);
        this._width = dbdata.width;
        this._height = dbdata.height;
        this._resolution = dbdata.resolution;
    }

    static async create(data: IImageContent): Promise<ImageContent | null> {
        const client = await conn.in.getClient();
        try {
            const newId = await this.generateId();
            if (!newId) return null;

            const res = await client.query(
                'INSERT t_image (' +
                ' id, ver, title, description, media_id, dept_id, user_id, ' +
                ' reg_date, pub_date, edition_id, page, ' +
                ' send_id, send_date, send_user, source, copyright, ' +
                ' fixed_type, image_type, status, ' +
                ' file_storage_id, file_extension, file_size, ' +
                ' color_id, width, height, resolution, lock ' +
                ') VALUES (' +
                ' $1,$2,$3,$4,$5,$6,$7,' +
                ' now(),$8,$9,$10,' +
                ' $11,TO_TIMESTAMP($12,\'YYYYMMDDHH24MISS\'),$13,$14,$15,' +
                ' $16,$17,$18,' +
                ' $19,$20,$21,' +
                ' $22,$23,$24,$25,$26) RETURNING id',
                [
                    newId, 0, data.title, data.description || null, data.mediaId, data.deptId || null, data.userId || null,
                    data.pubDate, data.editionId, data.page,
                    data.sendId || null, data.sendDate || null, data.sendUser || null, data.source || null, data.copyright || null,
                    data.fixedType, data.imageType, data.status,
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

    static async get(id: string): Promise<ImageContent | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, ver, title, description, media_id, dept_id, user_id, ' +
                ' TO_CHAR(reg_date, \'YYYYMMDDHH24MMISS\') reg_date, pub_date, edition_id, page, ' +
                ' send_id, TO_CHAR(send_date, \'YYYYMMDDHH24MMISS\') send_date, send_user, source, copyright, ' +
                ' fixed_type, image_type, status, ' +
                ' file_storage_id, file_extension, file_size, ' +
                ' color_id, width, height, resolution ' +
                'FROM t_image WHERE id=$1',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new ImageContent(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<ImageContent[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, ver, title, description, media_id, dept_id, user_id, ' +
                ' TO_CHAR(reg_date, \'YYYYMMDDHH24MMISS\') reg_date, pub_date, edition_id, page, ' +
                ' send_id, TO_CHAR(send_date, \'YYYYMMDDHH24MMISS\') send_date, send_user, source, copyright, ' +
                ' fixed_type, image_type, status, ' +
                ' file_storage_id, file_extension, file_size, ' +
                ' color_id, width, height, resolution ' +
                'FROM t_image ORDER BY id '
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new ImageContent(row));
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
                'UPDATE t_image SET ver=ver+1, ' +
                ' title=$1, description=$2, ' +
                ' pub_date=$3, edition_id=$4, page=$5, ' +
                ' source=$7, copyright=$8, ' +
                ' fixed_type=$9, image_type=$10, status=$11 ' +
                'WHERE id=$12 AND lock=1 RETURNING ver',
                [
                    this.title, this.description || null,
                    this.pubDate, this.editionId, this.page,
                    this.source || null, this.copyright || null,
                    this.fixedType, this.imageType, this.status,
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query('DELETE FROM t_image WHERE id=$1', [this.id]);
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
            const res = await client.query('UPDATE t_image SET lock=1, lock_date=now(), lock_user_id=$1 WHERE id=$2', [userId, this.id]);
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
                'FROM t_image C LEFT JOIN t_account_user U ON C.lock_user_id=U.id ' +
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
                res = await client.query('UPDATE t_image SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 AND lock_user_id=$4', [null, null, this.id, userId]);
            } else {
                res = await client.query('UPDATE t_image SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 ', [null, null, this.id]);
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
                res = await client.query('SELECT count(*) cnt FROM t_image WHERE id=$1 AND lock_user_id=$2 AND lock=1', [this.id, userId]);
            } else {
                res = await client.query('SELECT count(*) cnt FROM t_image WHERE id=$1 AND lock=1', [this.id]);
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
    get deptId() { return this._deptId; }
    get userId() { return this._userId; }
    get regDate() { return this._regDate; }
    get pubDate() { return this._pubDate; }
    get editionId() { return this._editionId; }
    get page() { return this._page; }
    get sendId() { return this._sendId; }
    get sendDate() { return this._sendDate; }
    get sendUser() { return this._sendUser; }
    get source() { return this._source; }
    get copyright() { return this._copyright; }
    get fixedType() { return this._fixedType; }
    get imageType() { return this._imageType; }
    get status() { return this._status; }
    get fileStorageId() { return this._fileStorageId; }
    get fileExtension() { return this._fileExtension; }
    get fileSize() { return this._fileSize; }
    get colorId() { return this._colorId; }
    get width() { return this._width; }
    get height() { return this._height; }
    get resolution() { return this._resolution; }
    get data() {
        return {
            id: this.id,
            ver: this.ver,
            title: this.title,
            description: this.description,
            mediaId: this.mediaId,
            deptId: this.deptId,
            userId: this.userId,
            regDate: this.regDate,
            pubDate: this.pubDate,
            editionId: this.editionId,
            page: this.page,
            sendId: this.sendId,
            sendDate: this.sendDate,
            sendUser: this.sendUser,
            source: this.source,
            copyright: this.copyright,
            fixedType: this.fixedType,
            imageType: this.imageType,
            status: this.status,
            fileStorageId: this.fileStorageId,
            fileExtension: this.fileExtension,
            fileSize: this.fileSize,
            colorId: this.colorId,
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
    set source(source) { this._source = source; }
    set copyright(copyright) { this._copyright = copyright; }
    set fixedType(fixedType) { this._fixedType = fixedType; }
    set imageType(imageType) { this._imageType = imageType; }
    set status(status) { this._status = status; }
};