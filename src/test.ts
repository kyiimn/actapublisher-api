import conn from './services/conn';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
    const client = await conn.in.getClient();
    //const res = (await client).query('INSERT INTO test (adata, data) VALUES ($1,$2)',
    //[[1,2], { a:'asdasd', b:'hyjtyuhyt'}]);
    const res = await client.query('SELECT * from test');
    console.log(res);
})();