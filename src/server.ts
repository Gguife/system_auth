import * as express from 'express';
import { Router, Request, Response } from 'express';

const app = express();

const route = Router();

app.use('/', (req: Request, res: Response) => {
  res.json({message: 'Hello world'})
});


app.use(route);

app.listen(8080, () => 'Server running on port 8080');