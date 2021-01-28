import conn from '../../services/conn';

export interface IAccountUser {
    id?: number,
    mediaId: number,
    mediaName?: string,
    deptId: number,
    deptName?: string,
    loginName: string,
    name: string,
    password?: string,
    email?: string,
    byline?: string,
    use: boolean,
    level: number,
    rule: number,
    fixed: boolean,
    originalData?: any
};

export class AccountUser {
    private _id: number;
    private _mediaId: number;
    private _mediaName: string;
    private _deptId: number;
    private _deptName: string;
    private _loginName: string;
    private _name: string;
    private _email?: string;
    private _byline?: string;
    private _use: boolean;
    private _level: number;
    private _rule: number;
    private _fixed: boolean;
    private _originalData?: any;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        this._deptId = parseInt(dbdata.dept_id, 10);
        this._deptName = dbdata.dept_name;
        this._loginName = dbdata.login_name;
        this._name = dbdata.name;
        this._email = dbdata.email;
        this._byline = dbdata.byline;
        this._use = dbdata.use ? true : false;
        this._level = dbdata.level;
        this._rule = dbdata.rule;
        this._fixed = dbdata.fixed ? true : false;
        this._originalData = dbdata.original_data || {};
    }

    static async create(data: IAccountUser): Promise<AccountUser | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_account_user (media_id, dept_id, login_name, name, password, email, byline, use, level, rule, fixed, original_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id ',
                [data.mediaId, data.deptId, data.loginName, data.name, data.password ? data.password : '',
                data.email ? data.email : null, data.byline ? data.byline : null, data.use ? 1 : 0, data.level,
                data.rule, data.fixed ? 1 : 0, data.originalData ? data.originalData : null]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<AccountUser | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' U.id, U.media_id, U.dept_id, U.login_name, U.name, U.email, U.byline, U.use, U.level, U.rule, U.fixed, U.original_data, ' +
                ' D.name dept_name, M.name media_name ' +
                'FROM t_account_user U ' +
                'LEFT JOIN t_config_media_def M ON M.id=U.media_id ' +
                'LEFT JOIN t_account_dept D ON D.id=U.dept_id ' +
                'WHERE U.id=$1 ',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new AccountUser(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async getByLoginName(loginName: string): Promise<AccountUser | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' U.id, U.media_id, U.dept_id, U.login_name, U.name, U.email, U.byline, U.use, U.level, U.rule, U.fixed, U.original_data, ' +
                ' D.name dept_name, M.name media_name ' +
                'FROM t_account_user U ' +
                'LEFT JOIN t_config_media_def M ON M.id=U.media_id ' +
                'LEFT JOIN t_account_dept D ON D.id=U.dept_id ' +
                'WHERE U.login_name=$1 ',
                [loginName]
            );
            if (res.rowCount < 1) return null;
            return new AccountUser(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async getByLoginIdWithPassword(loginId: string, password: string): Promise<AccountUser | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' U.id, U.media_id, U.dept_id, U.login_name, U.name, U.email, U.byline, U.use, U.level, U.rule, U.fixed, U.original_data, ' +
                ' D.name dept_name, M.name media_name ' +
                'FROM t_account_user U ' +
                'LEFT JOIN t_config_media_def M ON M.id=U.media_id ' +
                'LEFT JOIN t_account_dept D ON D.id=U.dept_id ' +
                'WHERE U.login_name=$1 AND U.password=$2',
                [loginId, password]
            );
            if (res.rowCount < 1) return null;
            return new AccountUser(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<AccountUser[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' U.id, U.media_id, U.dept_id, U.login_name, U.name, U.email, U.byline, U.use, U.level, U.rule, U.fixed, U.original_data, ' +
                ' D.name dept_name, M.name media_name ' +
                'FROM t_account_user U ' +
                'LEFT JOIN t_config_media_def M ON M.id=U.media_id ' +
                'LEFT JOIN t_account_dept D ON D.id=U.dept_id ' +
                'WHERE U.media_id=$1 ORDER BY U.dept_id, U.login_name ',
                [mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new AccountUser(row));
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
                'UPDATE t_account_user SET media_id=$1, dept_id=$2, name=$3, email=$4, byline=$5, use=$6, level=$7, rule=$8, fixed=$9, original_data=$10 WHERE id=$11',
                [this.mediaId, this.deptId, this.name, this.email, this.byline, this.use ? 1 : 0, this.level, this.rule, this.fixed ? 1 : 0, this.originalData ? this.originalData : null, this.id]
            );
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    async changePassword(password: string) {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('UPDATE t_account_user SET password=$1 WHERE id=$2', [password, this.id]);
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
            const res = await client.query('DELETE FROM t_account_user WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get mediaId() { return this._mediaId; }
    get mediaName() { return this._mediaName; }
    get deptId() { return this._deptId; }
    get deptName() { return this._deptName; }
    get loginName() { return this._loginName; }
    get name() { return this._name; }
    get email() { return this._email; }
    get byline() { return this._byline; }
    get use() { return this._use; }
    get level() { return this._level; }
    get rule() { return this._rule; }
    get fixed() { return this._fixed; }
    get originalData() { return this._originalData || {}; }
    get data(): IAccountUser {
        return {
            id: this.id,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            deptId: this.deptId,
            deptName: this.deptName,
            loginName: this.loginName,
            name: this.name,
            email: this.email,
            byline: this.byline,
            use: this.use,
            level: this.level,
            rule: this.rule,
            fixed: this.fixed,
            originalData: this.originalData
        };
    }

    set mediaId(mediaId) { this._mediaId = mediaId; }
    set deptId(deptId) { this._deptId = deptId; }
    set name(name) { this._name = name; }
    set email(email) { this._email = email; }
    set byline(byline) { this._byline = byline; }
    set use(use) { this._use = use; }
    set level(level) { this._level = level; }
    set rule(rule) { this._rule = rule; }
    set fixed(fixed) { this._fixed = fixed; }
    set originalData(originalData) { this._originalData = originalData; }
};