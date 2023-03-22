# Telegraf Cloudflare Test Repository

Rollup is used to bundle the Cloudflare Worker code into a single file.

Setup needs:

- `pnpm instal`
- create `.dev.vars` with:
  - TELEGRAM_WEBHOOK_SECRET = SOMETHING_RANDOM
  - TELEGRAM_BOT_TOKEN = BOT_TOKEN
- `pnpm dev` : for local testing (NOTE that some form of tunnel will is needed)
- `pnpm deploy:production` : for deploying to server

## `"telegraf": "^4.12.2"`

When using just the `rollup-plugin-node-polyfills` I get errors.

When I use the `unenv` aliases, I still get errors in runtime (process not defined) but when I then activate `node_compat=true` in the `wrangler.toml` I have a working telegraf bot.

All this is with version 4!

## `pnpm install git+ssh://git@github.com/telegraf/telegraf.git#v5`

Installing v5 branch fails with:

```bash
│ > telegraf@5.0.0-dev prepare
│ > npm run --silent build
│ src/composer.ts(514,21): error TS18048: 'ctx.message' is possibly 'undefined'.
│ src/composer.ts(514,33): error TS2339: Property 'entities' does not exist on type 'New & NonChannel & Message'.
│   Property 'entities' does not exist on type 'New & NonChannel & ChannelChatCreatedMessage'.
│ src/composer.ts(517,29): error TS18048: 'ctx.message' is possibly 'undefined'.
│ src/composer.ts(517,41): error TS2339: Property 'text' does not exist on type 'New & NonChannel & Message'.
│   Property 'text' does not exist on type 'New & NonChannel & ChannelChatCreatedMessage'.
```

I tried to checkout branch v5 into my `pnpm workspace` and fix it there / ignore the prepare install scripts…

But that came with it's own set of challenges.
