import conn from '../../services/conn';

export interface IAccountUser {
    id?: number,
    mediaId: number,
    deptId: number,
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
    private _deptId: number;
    private _loginName: string;
    private _name: string;
    private _email?: string;
    private _byline?: string;
    private _use: boolean;
    private _level: number;
    private _rule: number;
    private _fixed: boolean;
    private _originalData?: any;

    private constructor(data: any) {
        this._id = parseInt(data.id, 10);
        this._mediaId = parseInt(data.media_id, 10);
        this._deptId = parseInt(data.dept_id, 10);
        this._loginName = data.login_name;
        this._name = data.name;
        this._email = data.email;
        this._byline = data.byline;
        this._use = data.use ? true : false;
        this._level = data.level;
        this._rule = data.rule;
        this._fixed = data.fixed ? true : false;
        this._originalData = data.original_data || {};
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
                'SELECT id, media_id, dept_id, login_name, name, email, byline, use, level, rule, fixed, original_data FROM t_account_user WHERE id=$1',
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
                'SELECT id, media_id, dept_id, login_name, name, email, byline, use, level, rule, fixed, original_data FROM t_account_user WHERE login_name=$1',
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
                'SELECT id, media_id, dept_id, login_name, name, email, byline, use, level, rule, fixed, original_data FROM t_account_user WHERE login_name=$1 AND password=$2',
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
                'SELECT id, media_id, dept_id, login_name, name, email, byline, use, level, rule, fixed, original_data FROM t_account_user WHERE media_id=$1 ORDER BY dept_id, login_name ',
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
    get deptId() { return this._deptId; }
    get loginName() { return this._loginName; }
    get name() { return this._name; }
    get email() { return this._email; }
    get byline() { return this._byline; }
    get use() { return this._use; }
    get level() { return this._level; }
    get rule() { return this._rule; }
    get fixed() { return this._fixed; }
    get originalData() { return this._originalData || {}; }
    get data() {
        return {
            id: this.id,
            mediaId: this.mediaId,
            deptId: this.deptId,
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