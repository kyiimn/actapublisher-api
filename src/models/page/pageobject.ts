import conn from '../../services/conn';

export interface IPageObject {
    id?: number,
    pageId: string,
    objectType: string,
    objectId: string,
    frameId: string,
    frameType: string,
    posX: number,
    posY: number,
    width: number,
    height: number,
    option: { [key: string]: any }
}

export class PageObject {
    private _id: number;
    private _pageId: string;
    private _objectType: string;
    private _objectId: string;
    private _frameId: string;
    private _frameType: string;
    private _posX: number;
    private _posY: number;
    private _width: number;
    private _height: number;
    private _option: { [key: string]: any };

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._pageId = dbdata.page_id;
        this._objectType = dbdata.object_type;
        this._objectId = dbdata.object_id;
        this._frameId = dbdata.frame_id;
        this._frameType = dbdata.frame_type;
        this._posX = dbdata.pos_x;
        this._posY = dbdata.pos_y;
        this._width = dbdata.width;
        this._height = dbdata.height;
        this._option = dbdata.option;
    }

    get id() { return this._id; }
    get pageId() { return this._pageId; }
    get objectType() { return this._objectType; }
    get objectId() { return this._objectId; }
    get frameId() { return this._frameId; }
    get frameType() { return this._frameType; }
    get posX() { return this._posX; }
    get posY() { return this._posY; }
    get width() { return this._width; }
    get height() { return this._height; }
    get option() { return this._option; }
    get data() {
        return {
            id: this.id,
            pageId: this.pageId,
            objectType: this.objectType,
            objectId: this.objectId,
            frameId: this.frameId,
            frameType: this.frameType,
            posX: this.posX,
            posY: this.posY,
            width: this.width,
            height: this.height,
            option: this.option
        }
    }

    set objectType(objectType) { this._objectType = objectType; }
    set objectId(objectId) { this._objectId = objectId; }
    set posX(posX) { this._posX = posX; }
    set posY(posY) { this._posY = posY; }
    set width(width) { this._width = width; }
    set height(height) { this._height = height; }
    set option(option) { this._option = option; }

    static async create(data: IPageObject): Promise<PageObject | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT INTO t_page_object (' +
                ' page_id, object_type, object_id, frame_id, frame_type, pos_x, pos_y, width, height, option ' +
                ') VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',
                [
                    data.pageId, data.objectType, data.objectId, data.frameId, data.frameType,
                    data.posX, data.posY, data.width, data.height, data.option
                ]
            );
            if (res.rowCount < 1) return null;
            return this.get(res.rows[0].id);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<PageObject | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, page_id, object_type, object_id, frame_id, frame_type, pos_x, pos_y, width, height, option ' +
                'FROM t_page_object WHERE id=$1 ',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new PageObject(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByPageId(pageId: string): Promise<PageObject[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' id, page_id, object_type, object_id, frame_id, frame_type, pos_x, pos_y, width, height, option ' +
                'FROM t_page_object WHERE page_id=$1 ORDER BY pos_x ',
                [pageId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PageObject(row));
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
                'UPDATE t_page_object SET ' +
                ' object_type=$1, object_id=$2, pos_x=$3, pos_y=$4, width=$5, height=$6, option=$7 ' +
                'WHERE id=%8 ',
                [this.objectType, this.objectId, this.posX, this.posY, this.width, this.height, this.option, this.id]
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
            const res = await client.query('DELETE FROM t_page_object WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }
}