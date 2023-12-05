const crypto = require('crypto')
const express = require('express')
const api = require('./routes/api')
const csrf = require('./routes/csrf')

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use('/api', api)
app.use('/csrf', csrf)

app.get('/', (_, res) => {
  res.end('Top Page')
})

app.get('/csp', (_, res) => {
  const nonceValue = crypto.randomBytes(16).toString('base64')
  res.header(
    "Content-Security-Policy",
    `script-src 'nonce-${nonceValue}' 'strict-dynamic';` +
    "object-src 'none';" +
    "base-uri 'none';" +
    "require-trusted-types-for 'script';"
  )
  res.render('csp', { nonce: nonceValue })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})