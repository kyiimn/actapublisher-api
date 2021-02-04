import conn from '../../services/conn';
import Color from 'color';
import { CodeClassDef } from './codeclass';

export interface IColorDef {
    id?: number,
    code: string,
    name: string,
    mediaId: number,
    mediaName?: string,
    colorType: string,
    colorTypeName?: string,
    rgbCode?: string,
    sort: number
};

export class ColorDef {
    private _id: number;
    private _code: string;
    private _name: string;
    private _mediaId: number;
    private _mediaName: string;
    private _colorType: string;
    private _colorTypeName: string;
    private _sort: number;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._code = dbdata.code;
        this._name = dbdata.name;
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        this._colorType = dbdata.color_type;
        this._colorTypeName = dbdata.color_type_name;
        this._sort = dbdata.sort;
    }

    static async create(data: IColorDef): Promise<ColorDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_color_def (code, name, media_id, color_type, sort) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [data.code, data.name, data.mediaId, data.colorType, data.sort]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<ColorDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' C.id, C.code, C.name, C.media_id, C.color_type, C.sort, ' +
                ' M.name media_name, CO.name color_type_name ' +
                'FROM t_config_color_def C ' +
                'LEFT JOIN t_config_media_def M ON M.id = C.media_id ' +
                'LEFT JOIN t_config_code_def CO ON CO.class=$1 AND CO.code = C.color_type ' +
                'WHERE C.id=$2',
                [CodeClassDef.CLASS_COLORTYPE, id]
            );
            if (res.rowCount < 1) return null;
            return new ColorDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<ColorDef[] | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' C.id, C.code, C.name, C.media_id, C.color_type, C.sort, ' +
                ' M.name media_name, CO.name color_type_name ' +
                'FROM t_config_color_def C ' +
                'LEFT JOIN t_config_media_def M ON M.id = C.media_id ' +
                'LEFT JOIN t_config_code_def CO ON CO.class=$1 AND CO.code = C.color_type ' +
                'ORDER BY C.media_id, C.sort ',
                [CodeClassDef.CLASS_COLORTYPE]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new ColorDef(row));
            }
            return ret;
        } catch (e) {
            return null;
        } finally { 
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<ColorDef[] | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' C.id, C.code, C.name, C.media_id, C.color_type, C.sort, ' +
                ' M.name media_name, CO.name color_type_name ' +
                'FROM t_config_color_def C ' +
                'LEFT JOIN t_config_media_def M ON M.id = C.media_id ' +
                'LEFT JOIN t_config_code_def CO ON CO.class=$1 AND CO.code = C.color_type ' +
                'WHERE C.media_id = $2 ' +
                'ORDER BY C.sort ',
                [CodeClassDef.CLASS_COLORTYPE, mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new ColorDef(row));
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
                'UPDATE t_config_color_def SET name=$1, code=$2, color_type=$3 WHERE id=$4',
                [this.name, this.code, this.colorType, this.id]
            );
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
            const res = await client.query('DELETE FROM t_config_color_def WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get code() { return this._code; }
    get name() { return this._name; }
    get mediaId() { return this._mediaId; }
    get mediaName() { return this._mediaName; }
    get colorType() { return this._colorType; }
    get colorTypeName() { return this._colorTypeName; }
    get sort() { return this._sort; }
    get rgbCode(): string {
        if (this.colorType === 'RGB') {
            return this.code;
        } else {
            let c = 0, m = 0, y = 0, k = 0;
            if (this.colorType === 'CMYK') {
                c = parseInt(this.code.substr(1, 2), 16);
                m = parseInt(this.code.substr(3, 2), 16);
                y = parseInt(this.code.substr(5, 2), 16);
                k = parseInt(this.code.substr(7, 2), 16);
            } else {
                k = parseInt(this.code.substr(1, 2), 16);
            }
            return Color.cmyk([c, m, y, k]).hex();
        }
    }
    get data(): IColorDef {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            colorType: this.colorType,
            colorTypeName: this.colorTypeName,
            rgbCode: this.rgbCode,
            sort: this.sort
        };
    }
    set name(name) { this._name = name; }
    set code(code) { this._code = code; }
    set colorType(colorType) { this._colorType = colorType; }
    set sort(sort) { this._sort = sort; }
};