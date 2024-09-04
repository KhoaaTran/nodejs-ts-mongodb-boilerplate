import '~/config/env'
import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import databaseService from '~/services/database.services'
import authRouter from '~/routes/auth.routes'
import cors from 'cors'
import corsOptions from '~/config/cors'

const app = express()
const port = process.env.PORT
databaseService.connect()

app.use(cors(corsOptions))

app.use(express.json())
app.use('/', authRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})
