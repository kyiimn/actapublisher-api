import IContent from './';
import ILockInfo from '../ilockinfo';
import conn from '../../services/conn';

export interface IArticleContent {
    id?: string,
    ver: number,
    title: string,
    body: string,
    bodyType: string,
    articleType: string,
    status: string,
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
    private _articleType: string;
    private _status: string;
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
        this._articleType = dbdata.article_type;
        this._status = dbdata.status;
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
        if (dbdata.modifyDate) this._modifyDate = dbdata.modify_date;
        if (dbdata.modifyUserId) this._modifyUserId = parseInt(dbdata.modifyUserId, 10);
        if (dbdata.byline) this._byline = dbdata.byline;
    }

    static async create(data: IArticleContent): Promise<ArticleContent | null> {
        const client = await conn.in.getClient();
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, ver, title, body, body_type, article_type, status, ' +
                ' media_id, dept_id, user_id, ' +
                ' TO_CHAR(reg_date, \'YYYYMMDDHH24MMISS\') reg_date, pub_date, edition_id, page, ' +
                ' send_id, TO_CHAR(send_date, \'YYYYMMDDHH24MMISS\') send_date, send_user, source, copyright, ' +
                ' byline, lock ' +
                'FROM t_article WHERE id=$1',
                [id]
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, ver, title, body, body_type, article_type, status, ' +
                ' media_id, dept_id, user_id, ' +
                ' TO_CHAR(reg_date, \'YYYYMMDDHH24MMISS\') reg_date, pub_date, edition_id, page, ' +
                ' send_id, TO_CHAR(send_date, \'YYYYMMDDHH24MMISS\') send_date, send_user, source, copyright, ' +
                ' byline, lock ' +
                'FROM t_article ORDER BY id '
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
        const client = await conn.in.getClient();
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
        const client = await conn.in.getClient();
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

        const client = await conn.in.getClient();
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
        const client = await conn.in.getClient();
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

        const client = await conn.in.getClient();
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
        const client = await conn.in.getClient();
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
    get articleType() { return this._articleType; }
    get status() { return this._status; }
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
    get modifyDate() { return this._modifyDate; }
    get modifyUserId() { return this._modifyUserId; }
    get byline() { return this._byline; }
    get data() {
        return {
            id: this.id,
            ver: this.ver,
            title: this.title,
            body: this.body,
            bodyType: this.bodyType,
            articleType: this.articleType,
            status: this.status,
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