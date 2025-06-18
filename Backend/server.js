const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRouter = require('./routes/authRoutes')
const trajetRouter = require('./routes/trajetRoutes')
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/trajet', trajetRouter)

mongoose.connect(process.env.MONGO_CONNECTION)
.then(() => console.log('connected to mongodb'))
.catch((error) => console.error('failed to connect to mongodb', error))


const port = process.env.PORT || 3000 
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})