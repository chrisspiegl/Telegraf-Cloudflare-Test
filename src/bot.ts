import { Env} from './types'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

/**
 * In this file is all the telegraf bot logic.
 */

export const useBot = (env: Env) => {
  const bot = new Telegraf(env?.TELEGRAM_BOT_TOKEN)

  bot.command(/^reset$/i, async (ctx) => {
    return await ctx.reply('🦊 Got reset command.')
  })

  bot.command(/^myid$/i, async (ctx) => {
    return await ctx.reply(`🦊 Your ID is: \`${ctx.from.id}\`\n💬 Your Chat ID is: \`${ctx.chat.id}\``, { parse_mode: 'Markdown' })
  })

  bot.on(message('text'), async (ctx) => {
    console.log('🔥 I got a message…')
    return await ctx.reply('🦊 Got text message.\n\n' + JSON.stringify(ctx.message, null, 2))
  })

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))

  return bot
}
