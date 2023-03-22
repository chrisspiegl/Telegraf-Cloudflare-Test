import type { Env } from './types'
import h from './api'

/**
 * webhooks are handled by the api which is based on hono.
 */

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    console.log('🔥 I got a fetch…')
    try {
      return h.fetch(request, env as Env, ctx)
    } catch (error) {
      console.error('🔥 Error in Fetch', error)
      return new Response('Internal Server Error')
    }
  },
}
