import IContent from './';
import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';
import { CodeClassDef } from '../code/codeclass';

export interface IArticleContent {
    id?: string,
    ver: number,
    title: string,
    body: string,
    bodyType: string,
    bodyTypeName?: string,
    articleType: string,
    articleTypeName?: string,
    status: string,
    statusName?: string,
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
    sendId?: string,
    sendDate?: string,
    sendUser?: string,
    source?: string,
    sourceName?: string,
    copyright?: string,
    copyrightName?: string,
    modifyDate?: string,
    modifyUserId?: number,
    byline?: string
};

export class ArticleContent extends IContent {
    private _id: string;
    private _ver: number;
    private _title: string;
    private _body: string;
    private _bodyType: string;
    private _bodyTypeName: string;
    private _articleType: string;
    private _articleTypeName: string;
    private _status: string;
    private _statusName: string;
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
    private _sendId?: string;
    private _sendDate?: string;
    private _sendUser?: string;
    private _source?: string;
    private _sourceName?: string;
    private _copyright?: string;
    private _copyrightName?: string;
    private _modifyDate?: string;
    private _modifyUserId?: number;
    private _byline?: string;

    private constructor(dbdata: any) {
        super();

        this._id = dbdata.id;
        this._ver = dbdata.ver;
        this._title = dbdata.title;
        this._body = dbdata.body;
        this._bodyType = dbdata.body_type;
        this._bodyTypeName = dbdata.body_type_name;
        this._articleType = dbdata.article_type;
        this._articleTypeName = dbdata.article_type_name;
        this._status = dbdata.status;
        this._statusName = dbdata.status_name;
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        if (dbdata.dept_id) this._deptId = parseInt(dbdata.dept_id, 10);
        if (dbdata.dept_name) this._deptName = dbdata.dept_name;
        if (dbdata.user_id) this._userId = parseInt(dbdata.user_id, 10);
        if (dbdata.user_name) this._userName = dbdata.user_name;
        this._regDate = dbdata.reg_date;
        this._pubDate = dbdata.pub_date;
        this._editionId = parseInt(dbdata.edition_id, 10);
        this._editionName = dbdata.edition_name;
        this._page = dbdata.page;
        if (dbdata.send_id) this._sendId = dbdata.send_id;
        if (dbdata.send_date) this._sendDate = dbdata.send_date;
        if (dbdata.send_user) this._sendUser = dbdata.send_user;
        if (dbdata.source) this._source = dbdata.source;
        if (dbdata.source_name) this._sourceName = dbdata.source_name;
        if (dbdata.copyright) this._copyright = dbdata.copyright;
        if (dbdata.copyright_name) this._copyrightName = dbdata.copyright_name;
        if (dbdata.modifyDate) this._modifyDate = dbdata.modify_date;
        if (dbdata.modifyUserId) this._modifyUserId = parseInt(dbdata.modifyUserId, 10);
        if (dbdata.byline) this._byline = dbdata.byline;
    }

    static async create(data: IArticleContent): Promise<ArticleContent | null> {
        const client = await conn.getClient();
        try {
            const newId = await this.generateId();
            if (!newId) return null;

            const res = await client.query(
                'INSERT t_article (' +
                ' id, ver, title, body, body_type, article_type, status, ' +
                ' media_id, dept_id, user_id, ' +
                ' reg_date, pub_date, edition_id, page, ' +
                ' send_id, send_date, send_user, source, copyright, ' +
                ' byline, lock ' +
                ') VALUES (' +
                ' $1,$2,$3,$4,$5,$6,$7,' +
                ' $8,$9,$10,' +
                ' now(),$11,$12,$13,' +
                ' $14,TO_TIMESTAMP($15,\'YYYYMMDDHH24MISS\'),$16,$17,$18,' +
                ' $19,$20) RETURNING id',
                [
                    newId, 0, data.title, data.body, data.bodyType, data.articleType, data.status,
                    data.mediaId, data.deptId || null, data.userId || null,
                    data.pubDate, data.editionId, data.page,
                    data.sendId || null, data.sendDate || null, data.sendUser || null, data.source || null, data.copyright || null,
                    data.byline || null, 0
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

    static async get(id: string): Promise<ArticleContent | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.ver, A.title, A.body, A.body_type, A.article_type, A.status, ' +
                ' A.media_id, A.dept_id, A.user_id, A.byline, ' +
                ' TO_CHAR(A.reg_date, \'YYYYMMDDHH24MMISS\') reg_date, A.pub_date, A.edition_id, A.page, ' +
                ' A.send_id, TO_CHAR(A.send_date, \'YYYYMMDDHH24MMISS\') send_date, A.send_user, A.source, A.copyright, ' +
                ' M.name media_id, D.name dept_name, U.name user_name, E.name edition_name, ' +
                ' C1.name body_type_name, C2.name article_type_name, C3.name status_name, ' +
                ' C4.name source_name, C5.name copyright_name ' +
                'FROM t_article A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'LEFT JOIN t_account_dept D ON D.id = A.dept_id ' +
                'LEFT JOIN t_account_user U ON U.id = A.user_id ' +
                'LEFT JOIN t_config_edition_def E ON E.id = A.edition_id ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code = A.body_type ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code = A.article_type ' +
                'LEFT JOIN t_config_code_def C3 ON C3.class=$3 AND C3.code = A.status ' +
                'LEFT JOIN t_config_code_def C4 ON C4.class=$4 AND C4.code = A.source ' +
                'LEFT JOIN t_config_code_def C5 ON C5.class=$5 AND C5.code = A.copyright ' +
                'WHERE A.id=$6 ',
                [
                    CodeClassDef.CLASS_BODYTYPE, CodeClassDef.CLASS_ARTICLETYPE, CodeClassDef.CLASS_ARTICLESTATUS,
                    CodeClassDef.CLASS_SOURCE, CodeClassDef.CLASS_COPYRIGHT, id
                ]
            );
            if (res.rowCount < 1) return null;
            return new ArticleContent(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<ArticleContent[] | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' A.id, A.ver, A.title, A.body, A.body_type, A.article_type, A.status, ' +
                ' A.media_id, A.dept_id, A.user_id, A.byline, ' +
                ' TO_CHAR(A.reg_date, \'YYYYMMDDHH24MMISS\') reg_date, A.pub_date, A.edition_id, A.page, ' +
                ' A.send_id, TO_CHAR(A.send_date, \'YYYYMMDDHH24MMISS\') send_date, A.send_user, A.source, A.copyright, ' +
                ' M.name media_id, D.name dept_name, U.name user_name, E.name edition_name, ' +
                ' C1.name body_type_name, C2.name article_type_name, C3.name status_name, ' +
                ' C4.name source_name, C5.name copyright_name ' +
                'FROM t_article A ' +
                'LEFT JOIN t_config_media_def M ON M.id = A.media_id ' +
                'LEFT JOIN t_account_dept D ON D.id = A.dept_id ' +
                'LEFT JOIN t_account_user U ON U.id = A.user_id ' +
                'LEFT JOIN t_config_edition_def E ON E.id = A.edition_id ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code = A.body_type ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code = A.article_type ' +
                'LEFT JOIN t_config_code_def C3 ON C3.class=$3 AND C3.code = A.status ' +
                'LEFT JOIN t_config_code_def C4 ON C4.class=$4 AND C4.code = A.source ' +
                'LEFT JOIN t_config_code_def C5 ON C5.class=$5 AND C5.code = A.copyright ' +
                'FROM t_article A ORDER BY A.id ',
                [
                    CodeClassDef.CLASS_BODYTYPE, CodeClassDef.CLASS_ARTICLETYPE, CodeClassDef.CLASS_ARTICLESTATUS,
                    CodeClassDef.CLASS_SOURCE, CodeClassDef.CLASS_COPYRIGHT
                ]
           );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new ArticleContent(row));
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
                'UPDATE t_article SET ver=ver+1, ' +
                ' title=$1, body=$2, body_type=$3, article_type=$4, status=$5, ' +
                ' pub_date=$6, edition_id=$7, page=$8, ' +
                ' source=$7, copyright=$8, ' +
                ' modify_date=now(), modify_user_id=$9, byline=$10 ' +
                'WHERE id=$12 AND lock=1 RETURNING ver',
                [
                    this.title, this.body, this.bodyType, this.articleType, this.status,
                    this.pubDate, this.editionId, this.page,
                    this.source || null, this.copyright || null,
                    this.modifyUserId, this.byline || null,
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
            const res = await client.query('DELETE FROM t_article WHERE id=$1', [this.id]);
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
            const res = await client.query('UPDATE t_article SET lock=1, lock_date=now(), lock_user_id=$1 WHERE id=$2', [userId, this.id]);
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
                'FROM t_article C LEFT JOIN t_account_user U ON C.lock_user_id=U.id ' +
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
                res = await client.query('UPDATE t_article SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 AND lock_user_id=$4', [null, null, this.id, userId]);
            } else {
                res = await client.query('UPDATE t_article SET lock=0, lock_date=$1, lock_user_id=$2 WHERE id=$3 ', [null, null, this.id]);
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
                res = await client.query('SELECT count(*) cnt FROM t_article WHERE id=$1 AND lock_user_id=$2 AND lock=1', [this.id, userId]);
            } else {
                res = await client.query('SELECT count(*) cnt FROM t_article WHERE id=$1 AND lock=1', [this.id]);
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
    get body() { return this._body; }
    get bodyType() { return this._bodyType; }
    get bodyTypeName() { return this._bodyTypeName; }
    get articleType() { return this._articleType; }
    get articleTypeName() { return this._articleTypeName; }
    get status() { return this._status; }
    get statusName() { return this._statusName; }
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
    get sendId() { return this._sendId; }
    get sendDate() { return this._sendDate; }
    get sendUser() { return this._sendUser; }
    get source() { return this._source; }
    get sourceName() { return this._sourceName; }
    get copyright() { return this._copyright; }
    get copyrightName() { return this._copyrightName; }
    get modifyDate() { return this._modifyDate; }
    get modifyUserId() { return this._modifyUserId; }
    get byline() { return this._byline; }
    get data(): IArticleContent {
        return {
            id: this.id,
            ver: this.ver,
            title: this.title,
            body: this.body,
            bodyType: this.bodyType,
            bodyTypeName: this.bodyTypeName,
            articleType: this.articleType,
            articleTypeName: this.articleTypeName,
            status: this.status,
            statusName: this.statusName,
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
            sendId: this.sendId,
            sendDate: this.sendDate,
            sendUser: this.sendUser,
            source: this.source,
            sourceName: this.sourceName,
            copyright: this.copyright,
            copyrightName: this.copyrightName,
            modifyDate: this.modifyDate,
            modifyUserId: this.modifyUserId,
            byline: this.byline
        };
    }

    set title(title) { this._title = title; }
    set body(body) { this._body = body; }
    set bodyType(bodyType) { this._bodyType = bodyType; }
    set articleType(articleType) { this._articleType = articleType; }
    set status(status) { this._status = status; }
    set pubDate(pubDate) { this._pubDate = pubDate; }
    set editionId(editionId) { this._editionId = editionId; }
    set page(page) { this._page = page; }
    set source(source) { this._source = source; }
    set copyright(copyright) { this._copyright = copyright; }
    set modifyUserId(modifyUserId) { this._modifyUserId = modifyUserId; }
    set byline(byline) { this._byline = byline; }
};