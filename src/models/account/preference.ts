import conn from '../../services/conn';
import { CodeClassDef } from '../code/codeclass';

export interface IAccountPreference {
    id?: number,
    mediaId: number,
    mediaName?: string,
    frameUnitType: string,
    frameUnitTypeName?: string,
    textUnitType: string,
    textUnitTypeName?: string,
    dpi: number,
    options: {
        [key: string]: boolean | number | string
    }
};

export class AccountPreference {
    private _id: number;
    private _mediaId: number;
    private _mediaName: string;
    private _frameUnitType: string;
    private _frameUnitTypeName: string;
    private _textUnitType: string;
    private _textUnitTypeName: string;
    private _dpi: number;
    private _options: { [key: string]: boolean | number | string };

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        this._frameUnitType = dbdata.frame_unit_type;
        this._frameUnitTypeName = dbdata.frame_unit_type_name;
        this._textUnitType = dbdata.text_unit_type;
        this._textUnitTypeName = dbdata.text_unit_type_name;
        this._dpi = dbdata.dpi;
        this._options = dbdata.options;
    }

    static async create(data: IAccountPreference): Promise<AccountPreference | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'INSERT t_account_preference (media_id, frame_unit_type, text_unit_type, dpi, options) VALUES ($1, $2, $3, $4, $5) RETURNING id ',
                [data.mediaId, data.frameUnitType, data.textUnitType, data.dpi, data.options]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<AccountPreference | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' P.id, P.media_id, P.frame_unit_type, P.text_unit_type, P.dpi, P.options, ' +
                ' M.name media_name, C1.name frame_unit_type_name, C2.name text_unit_type_name ' +
                'FROM t_account_preference P ' +
                'LEFT JOIN t_config_media_def M ON M.id=P.media_id ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code=P.frame_unit_type ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code=P.text_unit_type ' +
                'WHERE P.id=$3 ',
                [CodeClassDef.CLASS_UNIT, CodeClassDef.CLASS_UNIT, id]
            );
            if (res.rowCount < 1) return null;
            return new AccountPreference(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async getByMediaId(mediaId: number): Promise<AccountPreference | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' P.id, P.media_id, P.frame_unit_type, P.text_unit_type, P.dpi, P.options, ' +
                ' M.name media_name, C1.name frame_unit_type_name, C2.name text_unit_type_name ' +
                'FROM t_account_preference P ' +
                'LEFT JOIN t_config_media_def M ON M.id=P.media_id ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code=P.frame_unit_type ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code=P.text_unit_type ' +
                'WHERE P.media_id=$3 ',
                [CodeClassDef.CLASS_UNIT, CodeClassDef.CLASS_UNIT, mediaId]
            );
            if (res.rowCount < 1) return null;
            return new AccountPreference(res.rows[0]);
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
                'UPDATE t_account_preference SET frame_unit_type=$1, text_unit_type=$2, dpi=$3, options=$4 WHERE id=$5',
                [this.frameUnitType, this.textUnitType, this.dpi, this.options, this.id]
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
            const res = await client.query('DELETE FROM t_account_preference WHERE id=$1', [this.id]);
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
    get frameUnitType() { return this._frameUnitType; }
    get frameUnitTypeName() { return this._frameUnitTypeName; }
    get textUnitType() { return this._textUnitType; }
    get textUnitTypeName() { return this._textUnitTypeName; }
    get dpi() { return this._dpi; }
    get options() { return this._options; }
    get data(): IAccountPreference {
        return {
            id: this.id,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            frameUnitType: this.frameUnitType,
            frameUnitTypeName: this.frameUnitTypeName,
            textUnitType: this.textUnitType,
            textUnitTypeName: this.textUnitTypeName,
            dpi: this.dpi,
            options: this.options
        };
    }
    set frameUnitType(frameUnitType) { this.frameUnitType = frameUnitType; }
    set textUnitType(textUnitType) { this.textUnitType = textUnitType; }
    set dpi(dpi) { this._dpi = dpi; }
    set options(options) { this.options = options; }
};