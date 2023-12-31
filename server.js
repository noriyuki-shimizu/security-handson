const crypto = require('crypto')
const express = require('express')
const api = require('./routes/api')
const csrf = require('./routes/csrf')

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(express.static('public', {
  setHeaders: (res, _, __) => {
    // 同一オリジンのみ許可
    // res.header('X-Frame-Options', 'SAMEORIGIN')
    // 全てのオリジンからも許可しない
    res.header('X-Frame-Options', 'DENY')
  }
}))

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

// フォームの内容を解析して req.body へ格納する
app.use(express.urlencoded({ extended: true }))

app.post('/signup', (req, res) => {
  console.log(req.body)
  res.send('アカウント登録しました')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})