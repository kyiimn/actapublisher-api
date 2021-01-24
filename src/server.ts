import App from './App';
import dotenv from 'dotenv';

dotenv.config();

const app = new App({
  origin: process.env.CORS || '*',
  optionsSuccessStatus: 200
}).application;

app.listen(parseInt(process.env.SERVER_PORT || '3000', 10), () => {
  console.log(`Server listening on port ${parseInt(process.env.SERVER_PORT || '3000', 10)}`);
});