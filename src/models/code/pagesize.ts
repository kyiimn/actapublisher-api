import conn from '../../services/conn';
import { CodeClassDef } from '../code/codeclass';

export interface IPageSizeDef {
    id?: number,
    name: string,
    paperType: string,
    paperTypeName?: string,
    paperWidth: number,
    paperHeight: number,
    paperDirection: string,
    paperDirectionName?: string,
    linespacingSize: number,
    linespacingUnit: string,
    linespacingUnitName?: string,
    linespacingRatio: number,
    columnMarginInside: number,
    columnMarginOutside: number,
    columnCount: number,
    columnSize: number,
    columnSpacing: number,
    columnOther: number,
    columnTotalSize: number,
    lineMarginTop: number,
    lineMarginBottom: number,
    lineHeight: number,
    lineCount: number,
    lineSpacing: number,
    lineOther: number,
    lineTotalSize: number
};

export class PageSizeDef {
    private _id: number;
    private _name: string;
    private _paperType: string;
    private _paperTypeName: string;
    private _paperWidth: number;
    private _paperHeight: number;
    private _paperDirection: string;
    private _paperDirectionName: string;
    private _linespacingSize: number;
    private _linespacingUnit: string;
    private _linespacingUnitName: string;
    private _linespacingRatio: number;
    private _columnMarginInside: number;
    private _columnMarginOutside: number;
    private _columnCount: number;
    private _columnSize: number;
    private _columnSpacing: number;
    private _columnOther: number;
    private _columnTotalSize: number;
    private _lineMarginTop: number;
    private _lineMarginBottom: number;
    private _lineHeight: number;
    private _lineCount: number;
    private _lineSpacing: number;
    private _lineOther: number;
    private _lineTotalSize: number;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._name = dbdata.name;
        this._paperType = dbdata.paper_type;
        this._paperTypeName = dbdata.paper_type_name;
        this._paperWidth = dbdata.paper_width;
        this._paperHeight = dbdata.paper_height;
        this._paperDirection = dbdata.paper_direction;
        this._paperDirectionName = dbdata.paper_direction_name;
        this._linespacingSize = dbdata.linespacing_size;
        this._linespacingUnit = dbdata.linespacing_unit;
        this._linespacingUnitName = dbdata.linespacing_unit_name;
        this._linespacingRatio = dbdata.linespacing_ratio;
        this._columnMarginInside = dbdata.col_margin_inside;
        this._columnMarginOutside = dbdata.col_margin_outside;
        this._columnCount = dbdata.col_count;
        this._columnSize = dbdata.col_size;
        this._columnSpacing = dbdata.col_spacing;
        this._columnOther = dbdata.col_other;
        this._columnTotalSize = dbdata.col_total_size;
        this._lineMarginTop = dbdata.line_margin_top;
        this._lineMarginBottom = dbdata.line_margin_bottom;
        this._lineHeight = dbdata.line_height;
        this._lineCount = dbdata.line_count;
        this._lineSpacing = dbdata.line_spacing;
        this._lineOther = dbdata.line_other;
        this._lineTotalSize = dbdata.line_total_size;
    }

    static async create(data: IPageSizeDef): Promise<PageSizeDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_page_size_def (' +
                ' name, paper_type, paper_width, paper_height, paper_direction, ' +
                ' linespacing_size, linespacing_unit, linespacing_ratio, ' +
                ' col_margin_inside, col_margin_outside, col_count, col_size, ' +
                ' col_spacing, col_other, col_total_size, ' +
                ' line_margin_top, line_margin_bottom, line_height, line_count, ' +
                ' line_spacing, line_other, line_total_size ' +
                ') VALUES (' +
                ' $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22' +
                ')', [
                    data.name, data.paperType, data.paperWidth, data.paperHeight, data.paperDirection,
                    data.linespacingSize, data.linespacingUnit, data.linespacingRatio,
                    data.columnMarginInside, data.columnMarginOutside, data.columnCount, data.columnSize,
                    data.columnSpacing, data.columnOther, data.columnTotalSize,
                    data.lineMarginTop, data.lineMarginBottom, data.lineHeight, data.lineCount,
                    data.lineSpacing, data.lineOther, data.lineTotalSize
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

    static async get(id: number): Promise<PageSizeDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' P.id, P.name, P.paper_type, P.paper_width, P.paper_height, P.paper_direction, ' +
                ' P.linespacing_size, P.linespacing_unit, P.linespacing_ratio, ' +
                ' P.col_margin_inside, P.col_margin_outside, P.col_count, P.col_size, ' +
                ' P.col_spacing, P.col_other, P.col_total_size, ' +
                ' P.line_margin_top, P.line_margin_bottom, P.line_height, P.line_count, ' +
                ' P.line_spacing, P.line_other, P.line_total_size, ' +
                ' C1.name paper_type_name, C2.name paper_direction_name, C3.name linespacing_unit_name ' +
                'FROM t_config_page_size_def P ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code = P.paper_type ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code = P.paper_direction ' +
                'LEFT JOIN t_config_code_def C3 ON C3.class=$3 AND C3.code = P.linespacing_unit ' +
                'WHERE P.id = $4',
                [CodeClassDef.CLASS_PAPERTYPE, CodeClassDef.CLASS_PAPERDIRECTION, CodeClassDef.CLASS_UNIT, id]
            );
            if (res.rowCount < 1) return null;
            return new PageSizeDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async select(): Promise<PageSizeDef[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT ' +
                ' P.id, P.name, P.paper_type, P.paper_width, P.paper_height, P.paper_direction, ' +
                ' P.linespacing_size, P.linespacing_unit, P.linespacing_ratio, ' +
                ' P.col_margin_inside, P.col_margin_outside, P.col_count, P.col_size, ' +
                ' P.col_spacing, P.col_other, P.col_total_size, ' +
                ' P.line_margin_top, P.line_margin_bottom, P.line_height, P.line_count, ' +
                ' P.line_spacing, P.line_other, P.line_total_size, ' +
                ' C1.name paper_type_name, C2.name paper_direction_name, C3.name linespacing_unit_name ' +
                'FROM t_config_page_size_def P ' +
                'LEFT JOIN t_config_code_def C1 ON C1.class=$1 AND C1.code = P.paper_type ' +
                'LEFT JOIN t_config_code_def C2 ON C2.class=$2 AND C2.code = P.paper_direction ' +
                'LEFT JOIN t_config_code_def C3 ON C3.class=$3 AND C3.code = P.linespacing_unit ' +
                'ORDER BY P.id ',
                [CodeClassDef.CLASS_PAPERTYPE, CodeClassDef.CLASS_PAPERDIRECTION, CodeClassDef.CLASS_UNIT]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new PageSizeDef(row));
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
                'UPDATE t_config_page_size_def SET ' +
                ' name=$1, paper_type=$2, paper_width=$3, paper_height=$4, paper_direction=$5, ' +
                ' linespacing_size=$6, linespacing_unit=$7, linespacing_ratio=$8, ' +
                ' col_margin_inside=$9, col_margin_outside=$10, col_count=$11, col_size=$12, ' +
                ' col_spacing=$13, col_other=$14, col_total_size=$15, ' +
                ' line_margin_top=$16, line_margin_bottom=$17, line_height=$18, line_count=$19, ' +
                ' line_spacing=$20, line_other=$21, line_total_size=$22 ' +
                'WHERE id=$23',
                [
                    this.name, this.paperType, this.paperWidth, this.paperHeight, this.paperDirection,
                    this.linespacingSize, this.linespacingUnit, this.linespacingRatio,
                    this.columnMarginInside, this.columnMarginOutside, this.columnCount, this.columnSize,
                    this.columnSpacing, this.columnOther, this.columnTotalSize,
                    this.lineMarginTop, this.lineMarginBottom, this.lineHeight, this.lineCount,
                    this.lineSpacing, this.lineOther, this.lineTotalSize, this.id
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
            const res = await client.query('DELETE FROM t_config_page_size_def WHERE id=$1', [this.id]);
            return true;
        } catch (e) {
            return false;
        } finally {
            client.release();
        }
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get paperType() { return this._paperType; }
    get paperTypeName() { return this._paperTypeName; }
    get paperWidth() { return this._paperWidth; }
    get paperHeight() { return this._paperHeight; }
    get paperDirection() { return this._paperDirection; }
    get paperDirectionName() { return this._paperDirectionName; }
    get linespacingSize() { return this._linespacingSize; }
    get linespacingUnit() { return this._linespacingUnit; }
    get linespacingUnitName() { return this._linespacingUnitName; }
    get linespacingRatio() { return this._linespacingRatio; }
    get columnMarginInside() { return this._columnMarginInside; }
    get columnMarginOutside() { return this._columnMarginOutside; }
    get columnCount() { return this._columnCount; }
    get columnSize() { return this._columnSize; }
    get columnSpacing() { return this._columnSpacing; }
    get columnOther() { return this._columnOther; }
    get columnTotalSize() { return this._columnTotalSize; }
    get lineMarginTop() { return this._lineMarginTop; }
    get lineMarginBottom() { return this._lineMarginBottom; }
    get lineHeight() { return this._lineHeight; }
    get lineCount() { return this._lineCount; }
    get lineSpacing() { return this._lineSpacing; }
    get lineOther() { return this._lineOther; }
    get lineTotalSize() { return this._lineTotalSize; }

    get data(): IPageSizeDef {
        return {
            id: this.id,
            name: this.name,
            paperType: this.paperType,
            paperTypeName: this.paperTypeName,
            paperWidth: this.paperWidth,
            paperHeight: this.paperHeight,
            paperDirection: this.paperDirection,
            paperDirectionName: this.paperDirectionName,
            linespacingSize: this.linespacingSize,
            linespacingUnit: this.linespacingUnit,
            linespacingUnitName: this.linespacingUnitName,
            linespacingRatio: this.linespacingRatio,
            columnMarginInside: this.columnMarginInside,
            columnMarginOutside: this.columnMarginOutside,
            columnCount: this.columnCount,
            columnSize: this.columnSize,
            columnSpacing: this.columnSpacing,
            columnOther: this.columnOther,
            columnTotalSize: this.columnTotalSize,
            lineMarginTop: this.lineMarginTop,
            lineMarginBottom: this.lineMarginBottom,
            lineHeight: this.lineHeight,
            lineCount: this.lineCount,
            lineSpacing: this.lineSpacing,
            lineOther: this.lineOther,
            lineTotalSize: this.lineTotalSize
        };
    }

    set name(name) { this._name = name; }
    set paperType(paperType) { this._paperType = paperType; }
    set paperWidth(paperWidth) { this._paperWidth = paperWidth; }
    set paperHeight(paperHeight) { this._paperHeight = paperHeight; }
    set paperDirection(paperDirection) { this._paperDirection = paperDirection; }
    set linespacingSize(linespacingSize) { this._linespacingSize = linespacingSize; }
    set linespacingUnit(linespacingUnit) { this._linespacingUnit = linespacingUnit; }
    set linespacingRatio(linespacingRatio) { this._linespacingRatio = linespacingRatio; }
    set columnMarginInside(columnMarginInside) { this._columnMarginInside = columnMarginInside; }
    set columnMarginOutside(columnMarginOutside) { this._columnMarginOutside = columnMarginOutside; }
    set columnCount(columnCount) { this._columnCount = columnCount; }
    set columnSize(columnSize) { this._columnSize = columnSize; }
    set columnSpacing(columnSpacing) { this._columnSpacing = columnSpacing; }
    set columnOther(columnOther) { this._columnOther = columnOther; }
    set columnTotalSize(columnTotalSize) { this._columnTotalSize = columnTotalSize; }
    set lineMarginTop(lineMarginTop) { this._lineMarginTop = lineMarginTop; }
    set lineMarginBottom(lineMarginBottom) { this._lineMarginBottom = lineMarginBottom; }
    set lineHeight(lineHeight) { this._lineHeight = lineHeight; }
    set lineCount(lineCount) { this._lineCount = lineCount; }
    set lineSpacing(lineSpacing) { this._lineSpacing = lineSpacing; }
    set lineOther(lineOther) { this._lineOther = lineOther; }
    set lineTotalSize(lineTotalSize) { this._lineTotalSize = lineTotalSize; }
};