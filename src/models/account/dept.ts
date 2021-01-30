import conn from '../../services/conn';

export interface IAccountDept {
    id: number,
    mediaId: number,
    mediaName?: string,
    name: string,
    sort: number,
    invalidFlag: boolean,
    group: boolean,
    groupMemberList?: number[]
};

export class AccountDept {
    private _id: number;
    private _mediaId: number;
    private _mediaName: string;
    private _name: string;
    private _sort: number;
    private _invalidFlag: boolean;
    private _group: boolean;
    private _groupMemberList?: number[];

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        this._name = dbdata.name;
        this._sort = dbdata.sort;
        this._invalidFlag = dbdata.invalid_flag ? true : false;
        this._group = dbdata.group ? true : false;
        this._groupMemberList = dbdata.group_list || [];
    }

    static async create(data: IAccountDept): Promise<AccountDept | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_account_dept (id, media_id, name, sort, invalid_flag, "group", group_list) VALUES ($1, $2, $3, $4, $5, $6, $7) ',
                [data.id, data.mediaId, data.name, data.sort, data.invalidFlag ? 1 : 0, data.group ? 1 : 0, data.groupMemberList || []]
            );
            return this.get(data.id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<AccountDept | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT D.id, D.media_id, D.name, D.sort, D.invalid_flag, D."group", D.group_list, M.name media_name FROM t_account_dept D ' +
                'LEFT JOIN t_config_media_def M ON M.id = D.media_id ' +
                'WHERE D.id=$1 ',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new AccountDept(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<AccountDept[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT D.id, D.media_id, D.name, D.sort, D.invalid_flag, D."group", D.group_list, M.name media_name FROM t_account_dept D ' +
                'LEFT JOIN t_config_media_def M ON M.id = D.media_id ' +
                'WHERE D.media_id=$1 ORDER BY D.sort ',
                [mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new AccountDept(row));
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
                'UPDATE t_account_dept SET name=$1, sort=$2, invalid_flag=$3, "group"=$4, group_list=$5 WHERE id=$6',
                [this.name, this.sort, this.invalidFlag ? 1 : 0, this.group ? 1 : 0, this.groupMemberList, this.id]
            );
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
            const res = await client.query('DELETE FROM t_account_dept WHERE id=$1', [this.id]);
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
    get name() { return this._name; }
    get sort() { return this._sort; }
    get invalidFlag() { return this._invalidFlag; }
    get group() { return this._group; }
    get groupMemberList() { return this._groupMemberList || []; }
    get data(): IAccountDept {
        return {
            id: this.id,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            name: this.name,
            sort: this.sort,
            invalidFlag: this.invalidFlag,
            group: this.group,
            groupMemberList: this.groupMemberList
        };
    }

    set name(name: string) { this._name = name; }
    set sort(sort: number) { this._sort = sort; }
    set invalidFlag(invalidFlag: boolean) { this._invalidFlag = invalidFlag; }
    set group(group: boolean) { this._group = group; }
    set groupMemberList(groupMemberList: number[]) { this._groupMemberList = groupMemberList; }
};