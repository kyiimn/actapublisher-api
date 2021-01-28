import conn from '../../services/conn';

export interface IFontDef {
    id?: number,
    mediaId: number,
    name: string,
    fileStorageId: number,
    fileExtension: string,
    fileSize: number,
    sort: number
};

export class FontDef {
    private _id: number;
    private _mediaId: number;
    private _name: string;
    private _fileStorageId: number;
    private _fileExtension: string;
    private _fileSize: number;
    private _sort: number;

    private constructor(dbdata: any) {
        this._id = parseInt(dbdata.id, 10);
        this._mediaId = parseInt(dbdata.media_id, 10);
        this._name = dbdata.name;
        this._fileStorageId = parseInt(dbdata.file_storage_id, 10);
        this._fileExtension = dbdata.file_extension;
        this._fileSize = dbdata.file_size,
        this._sort = dbdata.sort;
    }

    static async create(data: IFontDef): Promise<FontDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'INSERT t_config_font_def (media_id, name, file_storage_id, file_extension, file_size, sort) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [data.mediaId, data.name, data.fileStorageId, data.fileExtension, data.fileSize, data.sort]
            );
            if (res.rowCount < 1) return null;

            return this.get(res.rows[0].id);
        } catch(e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async get(id: number): Promise<FontDef | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query('SELECT id, media_id, name, file_storage_id, file_extension, file_size, sort FROM t_config_font_def WHERE id=$1', [id]);
            if (res.rowCount < 1) return null;
            return new FontDef(res.rows[0]);
        } catch (e) {
            return null;
        } finally {
            client.release();
        }
    }

    static async selectByMediaId(mediaId: number): Promise<FontDef[] | null> {
        const client = await conn.in.getClient();
        try {
            const res = await client.query(
                'SELECT id, media_id, name, file_storage_id, file_extension, file_size, sort FROM t_config_font_def ORDER BY media_id, sort, id',
                [mediaId]
            );
            let ret = [];
            for (const row of res.rows) {
                ret.push(new FontDef(row));
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
                'UPDATE t_config_font_def SET name=$1, sort=$2 WHERE id=$3',
                [this.name, this.sort, this.id]
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
            const res = await client.query('DELETE FROM t_config_font_def WHERE id=$1', [this.id]);
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
    get fileStorageId() { return this._fileStorageId; }
    get fileExtension() { return this._fileExtension; }
    get fileSize() { return this._fileSize; }
    get sort() { return this._sort; }
    get data() {
        return {
            id: this.id,
            mediaId: this.mediaId,
            name: this.name,
            fileStorageId: this.fileStorageId,
            fileExtension: this.fileExtension,
            fileSize: this.fileSize,
            sort: this.sort
        };
    }

    set name(name) { this._name = name; }
    set sort(sort) { this._sort = sort; }
};