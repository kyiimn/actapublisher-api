import conn from '../../models/conn';

export default {
    codeclass: async (mediaId: number) => {
        const client = await conn.in.getClient();
        let ret: any[] | boolean = false
        try {
            const res = await client.query('SELECT class, code, name, sort, use FROM t_config_code_def WHERE media_id=$1 OR media_id IS NULL ORDER BY class, sort, code, name', [mediaId]);
            ret = [];
            for (const row of res.rows) {
                ret.push(row);
            }
        } finally {
            client.release()
        }
        return ret;
    }
};