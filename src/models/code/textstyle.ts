import { StringMappingType } from 'typescript';
import conn from '../../services/conn';

export interface ITextStyleDef {
    id: number,
    mediaId: number,
    name: string,
    sort: number,
    fontId: number,
    fontSize: number,
    color: string,
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
    private _name: string;
    private _sort: number;
    private _fontId: number;
    private _fontSize: number;
    private _color: string;
    private _xscale: number;
    private _letterSpacing: number;
    private _lineHeight: number;
    private _textAlign: number;
    private _underline: boolean;
    private _strikeline: boolean;
    private _indent: number;

    private constructor(data: any) {
        this._id = parseInt(data.id, 10);
        this._mediaId = parseInt(data.media_id, 10);
        this._name = data.name;
        this._sort = data.sort;
        this._fontId = parseInt(data.font_id, 10);
        this._fontSize = data.font_size;
        this._color = data.color;
        this._xscale = data.xscale;
        this._letterSpacing = data.letter_spacing;
        this._lineHeight = data.line_height;
        this._textAlign = data.text_align;
        this._underline = data.underline ? true : false;
        this._strikeline = data.strikeline ? true : false;
        this._indent = data.indent;
    }

    static async create(data: ITextStyleDef): Promise<TextStyleDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_textstyle_def (' +
                ' media_id, name, sort, ' +
                ' font_id, font_size, color, xscale, letter_spacing, line_height, ' +
                ' text_align, underline, strikeline, indent' +
                ') VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
                [
                    data.mediaId, data.name, data.sort,
                    data.fontId, data.fontSize, data.color, data.xscale, data.letterSpacing, data.lineHeight,
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' media_id, name, sort, ' +
                ' font_id, font_size, color, xscale, letter_spacing, line_height, ' +
                ' text_align, underline, strikeline, indent' +
                'FROM t_config_textstyle_def WHERE id=$1',
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' media_id, name, sort, ' +
                ' font_id, font_size, color, xscale, letter_spacing, line_height, ' +
                ' text_align, underline, strikeline, indent' +
                'FROM t_config_textstyle_def WHERE media_id=? ORDER BY media_id, sort, id ',
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
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'UPDATE t_config_textstyle_def SET ' +
                ' name=$1, sort=$2, ' +
                ' font_id=$3, font_size=$4, color=$5, xscale=$6, letter_spacing=$7, line_height=$8, ' +
                ' text_align=$9, underline=$10, strikeline=$11, indent=$12' +
                'WHERE id=$13',
                [
                    this.name, this.sort,
                    this.fontId, this.fontSize, this.color, this.xscale, this.letterSpacing, this.lineHeight,
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
        const client = await conn.in.getClient();
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
    get name() { return this._name; }
    get sort() { return this._sort; }
    get fontId() { return this._fontId; }
    get fontSize() { return this._fontSize; }
    get color() { return this._color; }
    get xscale() { return this._xscale; }
    get letterSpacing() { return this._letterSpacing; }
    get lineHeight() { return this._lineHeight; }
    get textAlign() { return this._textAlign; }
    get underline() { return this._underline; }
    get strikeline() { return this._strikeline; }
    get indent() { return this._indent; }
    get data() {
        return {
            id: this.id,
            mediaId: this.mediaId,
            name: this.name,
            sort: this.sort,
            fontId: this.fontId,
            fontSize: this.fontSize,
            color: this.color,
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
    set color(color) { this._color = color; }
    set xscale(xscale) { this._xscale = xscale; }
    set letterSpacing(letterSpacing) { this._letterSpacing = letterSpacing; }
    set lineHeight(lineHeight) { this._lineHeight = lineHeight; }
    set textAlign(textAlign) { this._textAlign = textAlign; }
    set underline(underline) { this._underline = underline; }
    set strikeline(underline) { this._strikeline = underline; }
    set indent(indent) { this._indent = indent; }
};