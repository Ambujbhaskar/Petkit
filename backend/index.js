require("dotenv").config()
const express = require('express')
const cors = require('cors')

const authMiddleware = require("./middlewares/auth");
const errorMiddleware = require("./middlewares/error");

const accountRouter = require('./routes/account');
const userRouter = require('./routes/user');
const clinicsRouter = require('./routes/clinics');
const requestsRouter = require('./routes/requests');
const petsRouter = require('./routes/pets');
const articlesRouter = require('./routes/articles');
const appointmentsRouter = require('./routes/appointments');

const app = express();
app.use(cors());
app.use(express.json());

app.use(authMiddleware);
app.use(errorMiddleware);

app.use('/api/account', accountRouter);
app.use('/api/user', userRouter);
app.use('/api/clinics', clinicsRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/pets', petsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/appointments', appointmentsRouter);

const port = process.env.PORT || 3001
app.listen(port, () => {
	console.info(`Server started on port ${port}...`)
});