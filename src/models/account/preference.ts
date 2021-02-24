import { convertTypeAcquisitionFromJson } from 'typescript';
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
    defaultBodyTextStyleId: number,
    defaultBodyTextStyleName?: string,
    defaultTitleTextStyleId: number,
    defaultTitleTextStyleName?: string,
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
    private _defaultBodyTextStyleId: number;
    private _defaultBodyTextStyleName: string;
    private _defaultTitleTextStyleId: number;
    private _defaultTitleTextStyleName: string;
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
        this._defaultBodyTextStyleId = parseInt(dbdata.default_body_textstyle_id, 10);
        this._defaultBodyTextStyleName = dbdata.default_body_textstyle_name;
        this._defaultTitleTextStyleId = parseInt(dbdata.default_title_textstyle.id, 10);
        this._defaultTitleTextStyleName = dbdata.default_title_textstyle_name;
        this._dpi = dbdata.dpi;
        this._options = dbdata.options;
    }

    static async create(data: IAccountPreference): Promise<AccountPreference | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'INSERT t_account_preference (media_id, frame_unit_type, text_unit_type, default_body_textstyle_id, default_title_textstyle_id, dpi, options) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id ',
                [data.mediaId, data.frameUnitType, data.textUnitType, data.defaultBodyTextStyleId, data.defaultTitleTextStyleId, data.dpi, data.options]
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
                ' P.id, P.media_id, P.frame_unit_type, P.text_unit_type, P.default_body_textstyle_id, P.default_title_textstyle_id, P.dpi, P.options, ' +
                ' M.name media_name, C1.name frame_unit_type_name, C2.name text_unit_type_name, ' + 
                ' T1.name default_title_textstyle_name, T2.name default_title_textstyle_name' +
                'FROM t_account_preference P ' +
                'LEFT JOIN t_config_media_def M ON M.id=P.media_id ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code=P.frame_unit_type ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code=P.text_unit_type ' +
                'LEFT JOIN t_config_textstyle_def T1 ON P.default_body_textstyle_id = T1.id ' +
                'LEFT JOIN t_config_textstyle_def T2 ON p.default_title_textstyle_id = T2.id ' +
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
                ' P.id, P.media_id, P.frame_unit_type, P.text_unit_type, P.default_body_textstyle_id, P.default_title_textstyle_id, P.dpi, P.options, ' +
                ' M.name media_name, C1.name frame_unit_type_name, C2.name text_unit_type_name, ' + 
                ' T1.name default_title_textstyle_name, T2.name default_title_textstyle_name' +
                'FROM t_account_preference P ' +
                'LEFT JOIN t_config_media_def M ON M.id=P.media_id ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code=P.frame_unit_type ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code=P.text_unit_type ' +
                'LEFT JOIN t_config_textstyle_def T1 ON P.default_body_textstyle_id = T1.id ' +
                'LEFT JOIN t_config_textstyle_def T2 ON p.default_title_textstyle_id = T2.id ' +
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
                'UPDATE t_account_preference SET ' +
                ' frame_unit_type=$1, text_unit_type=$2, ' + 
                ' default_body_textstyle_id=$3, default_title_textstyle_id=$4, ' +
                ' dpi=$5, options=$6 ' +
                'WHERE id=$7',
                [
                    this.frameUnitType, this.textUnitType,
                    this.defaultBodyTextStyleId, this.defaultTitleTextStyleId,
                    this.dpi, this.options, this.id
                ]
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
    get defaultBodyTextStyleId() { return this._defaultBodyTextStyleId; }
    get defaultBodyTextStyleName() { return this._defaultBodyTextStyleName; }
    get defaultTitleTextStyleId() { return this._defaultTitleTextStyleId; }
    get defaultTitleTextStyleName() { return this._defaultTitleTextStyleName; }
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
            defaultBodyTextStyleId: this.defaultBodyTextStyleId,
            defaultBodyTextStyleName: this.defaultBodyTextStyleName,
            defaultTitleTextStyleId: this.defaultTitleTextStyleId,
            defaultTitleTextStyleName: this.defaultTitleTextStyleName,
            dpi: this.dpi,
            options: this.options
        };
    }
    set frameUnitType(frameUnitType) { this.frameUnitType = frameUnitType; }
    set textUnitType(textUnitType) { this.textUnitType = textUnitType; }
    set defaultBodyTextStyleId(textStyle) { this._defaultBodyTextStyleId = textStyle; }
    set defaultTitleTextStyleId(textStyle) { this._defaultTitleTextStyleId = textStyle; }
    set dpi(dpi) { this._dpi = dpi; }
    set options(options) { this.options = options; }
};