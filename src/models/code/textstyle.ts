import conn from '../../services/conn';

export interface ITextStyleDef {
    id?: number,
    mediaId: number,
    mediaName?: string,
    name: string,
    sort: number,
    fontId: number,
    fontName?: string,
    fontSize: number,
    colorId: number,
    colorName?: string,
    xscale: number,
    letterSpacing: number,
    lineHeight: number,
    textAlign: number,
    underline: boolean,
    strikeline: boolean,
    indent: number
};

export class TextStyleDef {
    private _id: number;
    private _mediaId: number;
    private _mediaName: string;
    private _name: string;
    private _sort: number;
    private _fontId: number;
    private _fontName: string;
    private _fontSize: number;
    private _colorId: number;
    private _colorName: string;
    private _xscale: number;
    private _letterSpacing: number;
    private _lineHeight: number;
    private _textAlign: number;
    private _underline: boolean;
    private _strikeline: boolean;
    private _indent: number;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._mediaName = dbdata.media_name;
        this._name = dbdata.name;
        this._sort = dbdata.sort;
        this._fontId = parseInt(dbdata.font_id, 10);
        this._fontName = dbdata.font_name;
        this._fontSize = parseFloat(dbdata.font_size);
        this._colorId = parseInt(dbdata.color_id, 10);
        this._colorName = dbdata.color_name;
        this._xscale = parseFloat(dbdata.xscale);
        this._letterSpacing = parseFloat(dbdata.letter_spacing);
        this._lineHeight = parseFloat(dbdata.line_height);
        this._textAlign = dbdata.text_align;
        this._underline = dbdata.underline ? true : false;
        this._strikeline = dbdata.strikeline ? true : false;
        this._indent = parseFloat(dbdata.indent);
    }

    static async create(data: ITextStyleDef): Promise<TextStyleDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_textstyle_def (' +
                ' media_id, name, sort, ' +
                ' font_id, font_size, color_id, xscale, letter_spacing, line_height, ' +
                ' text_align, underline, strikeline, indent ' +
                ') VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
                [
                    data.mediaId, data.name, data.sort,
                    data.fontId, data.fontSize, data.colorId, data.xscale, data.letterSpacing, data.lineHeight,
                    data.textAlign, data.underline ? 1 : 0, data.strikeline ? 1 : 0, data.indent
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

    static async get(id: number): Promise<TextStyleDef | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' T.id, T.media_id, T.name, T.sort, ' +
                ' T.font_id, T.font_size, T.color_id, T.xscale, T.letter_spacing, T.line_height, ' +
                ' T.text_align, T.underline, T.strikeline, T.indent, ' +
                ' M.name media_name, F.name font_name, C.name color_name ' +
                'FROM t_config_textstyle_def T ' +
                'LEFT JOIN t_config_media_def M ON M.id = T.media_id ' +
                'LEFT JOIN t_config_font_def F ON F.id = T.font_id ' +
                'LEFT JOIN t_config_color_def C ON C.id = T.color_id ' +
                'WHERE T.id=$1',
                [id]
            );
            if (res.rowCount < 1) return null;
            return new TextStyleDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<TextStyleDef[] | null> {
        const client = await conn.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' T.id, T.media_id, T.name, T.sort, ' +
                ' T.font_id, T.font_size, T.color_id, T.xscale, T.letter_spacing, T.line_height, ' +
                ' T.text_align, T.underline, T.strikeline, T.indent, ' +
                ' M.name media_name, F.name font_name, C.name color_name ' +
                'FROM t_config_textstyle_def T ' +
                'LEFT JOIN t_config_media_def M ON M.id = T.media_id ' +
                'LEFT JOIN t_config_font_def F ON F.id = T.font_id ' +
                'LEFT JOIN t_config_color_def C ON C.id = T.color_id ' +
                'WHERE T.media_id=$1  ' +
                'ORDER BY T.media_id, T.sort, T.id ',
                [mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new TextStyleDef(row));
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
                'UPDATE t_config_textstyle_def SET ' +
                ' name=$1, sort=$2, ' +
                ' font_id=$3, font_size=$4, color_id=$5, xscale=$6, letter_spacing=$7, line_height=$8, ' +
                ' text_align=$9, underline=$10, strikeline=$11, indent=$12 ' +
                'WHERE id=$13',
                [
                    this.name, this.sort,
                    this.fontId, this.fontSize, this.colorId, this.xscale, this.letterSpacing, this.lineHeight,
                    this.textAlign, this.underline ? 1 : 0, this.strikeline ? 1 : 0, this.indent,
                    this.id
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
            const res = await client.query('DELETE FROM t_config_textstyle_def WHERE id=$1', [this.id]);
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
    get fontId() { return this._fontId; }
    get fontName() { return this._fontName; }
    get fontSize() { return this._fontSize; }
    get colorId() { return this._colorId; }
    get colorName() { return this._colorName; }
    get xscale() { return this._xscale; }
    get letterSpacing() { return this._letterSpacing; }
    get lineHeight() { return this._lineHeight; }
    get textAlign() { return this._textAlign; }
    get underline() { return this._underline; }
    get strikeline() { return this._strikeline; }
    get indent() { return this._indent; }
    get data(): ITextStyleDef {
        return {
            id: this.id,
            mediaId: this.mediaId,
            mediaName: this.mediaName,
            name: this.name,
            sort: this.sort,
            fontId: this.fontId,
            fontName: this.fontName,
            fontSize: this.fontSize,
            colorId: this.colorId,
            colorName: this.colorName,
            xscale: this.xscale,
            letterSpacing: this.letterSpacing,
            lineHeight: this.lineHeight,
            textAlign: this.textAlign,
            underline: this.underline,
            strikeline: this.strikeline,
            indent: this.indent
        };
    }

    set name(name) { this._name = name; }
    set sort(sort) { this._sort = sort; }
    set fontId(fontId) { this._fontId = fontId; }
    set fontSize(fontSize) { this._fontSize = fontSize; }
    set colorId(colorId) { this._colorId = colorId; }
    set xscale(xscale) { this._xscale = xscale; }
    set letterSpacing(letterSpacing) { this._letterSpacing = letterSpacing; }
    set lineHeight(lineHeight) { this._lineHeight = lineHeight; }
    set textAlign(textAlign) { this._textAlign = textAlign; }
    set underline(underline) { this._underline = underline; }
    set strikeline(underline) { this._strikeline = underline; }
    set indent(indent) { this._indent = indent; }
};