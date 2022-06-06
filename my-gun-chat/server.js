const express = require("express")
const app = express()
const Gun = require('gun')
const PORT = 3000

app.use(Gun.serve)

app.use(express.static(__dirname))

const server = app.listen(PORT)

Gun({ web: server })