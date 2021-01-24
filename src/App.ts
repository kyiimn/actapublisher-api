import express from 'express';
import cors from 'cors';

class App {
    public application: express.Application;

    constructor(corsOptions?: cors.CorsOptions) {
        this.application = express();
        this.application.use(cors(corsOptions));
        this.router();
    }

    private router(): void {
        this.application.get('/', (req: express.Request, res: express.Response) => {
            res.send('hello!');
        });
    }
}
export default App;