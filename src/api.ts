import { Hono } from 'hono'
import { logger } from 'hono/logger'

import { useBot } from './bot'

/**
 * This API is used to process the webhook and to set the webhook dynamically.
 */

const h = new Hono()

h.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

h.use('*', logger())

h.post('/webhook-telegram-bot/*', async (c) => {
  if (!c.req.path.endsWith(c.env?.TELEGRAM_WEBHOOK_SECRET as any)) {
    c.status(401)
    return c.json({ error: true, msg: 'not authorized' })
  }
  const bot = useBot(c.env as any)
  function handle() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      let bodyResponse
      await bot.handleUpdate(await c.req.json(), telegrafResponseBuilder(c, (body: any) => {
        console.log('🏋️‍♀️ telegrafResponseBuilder body', body)
        bodyResponse = body
      }))
      return resolve(bodyResponse)
    })
  }
  function telegrafResponseBuilder(c: any, callback: Function) {
    let writableEnded = false
    const modRes = Object.assign(c.res, {
      headersSent: false,
      setHeader: (name: any, value: any) => {
        console.log('telegrafResponseBuilder setHeader', name, value)
        c.header(name, value)
      },
      end: (data: any) => {
        console.log('telegrafResponseBuilder', data, writableEnded)

        if (writableEnded) {
          return
        }
        // res.body = data
        callback(data)
        writableEnded = true
      },
    })
    Object.defineProperty(modRes, 'writableEnded', {
      get: () => writableEnded,
    })
    return modRes
  }
  const body: any = await handle()
  c.status(200)
  return c.body(body)
})

h.get('/bot/setWebhook', async (c) => {
  console.log('Processing setWebhook')
  try {
    const url = new URL(c.req.url)
    const protocol = c.req.headers.has('x-forwarded-proto') ? `${c.req.headers.get('x-forwarded-proto')}:` : url.protocol
    const baseUrl = `${protocol}//${url.host}${url.port ? `:${url.port}` : ''}`
    const bot = useBot(c.env as any)
    await bot.telegram.setWebhook(`${baseUrl}/webhook-telegram-bot/${c.env?.TELEGRAM_WEBHOOK_SECRET}`)
    const getWebhookInfo = await bot.telegram.getWebhookInfo()
    return c.json(getWebhookInfo)
  } catch (error) {
    console.log('🔥 Error in setWebhook:', error)
  }
})

h.get('/bot/getWebhook', async (c) => {
  const bot = useBot(c.env as any)
  const getWebhookInfo = await bot.telegram.getWebhookInfo()
  return c.json(getWebhookInfo)
})

h.get('/bot/deleteWebhook', async (c) => {
  const bot = useBot(c.env as any)
  await bot.telegram.deleteWebhook()
  const getWebhookInfo = await bot.telegram.getWebhookInfo()
  return c.json(getWebhookInfo)
})

h.get('/', async (c) => {
  return c.text("Telegraf Cloudflare Test")
})

export default h
