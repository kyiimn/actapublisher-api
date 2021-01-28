import conn from '../../services/conn';

export interface IPagePrint {
    id?: number,
    publishId: number,
    editionId: number,
    localId: number,
    adverLocalId: number,
    printTypeId: number,
    status: string
}

export class PagePrint {
    private _id: number;
    private _publishId: number;
    private _editionId: number;
    private _localId: number;
    private _adverLocalId: number;
    private _printTypeId: number;
    private _status: string;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._publishId = parseInt(dbdata.publish_id, 10);
        this._editionId = parseInt(dbdata.edition_id, 10);
        this._localId = parseInt(dbdata.local_id, 10);
        this._adverLocalId = parseInt(dbdata.adver_local_id, 10);
        this._printTypeId = parseInt(dbdata.print_type_id, 10);
        this._status = dbdata.status;
    }

    get id() { return this._id; }
    get publishId() { return this._publishId; }
    get editionId() { return this._editionId; }
    get localId() { return this._localId; }
    get adverLocalId() { return this._adverLocalId; }
    get printTypeId() { return this._printTypeId; }
    get status() { return this._status; }
    get data() {
        return {
            id: this.id,
            publishId: this.publishId,
            editionId: this.editionId,
            localId: this.localId,
            adverLocalId: this.adverLocalId,
            printTypeId: this.printTypeId,
            status: this.status
        };
    }

    set status(status) { this._status = status; }

    static async create(data: IPagePrint): Promise<PagePrint | null> {
        const client = await conn.in.getClient();
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT id, publish_id, edition_id, local_id, adver_local_id, print_type_id, status ' +
                'FROM t_page_print WHERE id=$1 ',
                [id]
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT id, publish_id, edition_id, local_id, adver_local_id, print_type_id, status ' +
                'FROM t_page_print WHERE publish_id=$1 ' +
                'ORDER BY publish_id, edition_id, local_id, adver_local_id DESC ',
                [publishId]
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
        const client = await conn.in.getClient();
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
        const client = await conn.in.getClient();
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