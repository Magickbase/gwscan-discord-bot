import 'dotenv/config'

export const config = {
  token: process.env.DISCORD_TOKEN,
  publicKey: process.env.PUBLIC_KEY,
  server: process.env.SERVER,
  appId: process.env.APP_ID,
  guildId: process.env.GUILD_ID,
}

/**
 * logo url used in embed message
 */
export const LOGO_URL = 'https://www.gwscan.com/icons/nervina-logo.svg'
/**
 * gwscan url used on opening explorer from message
 */
export const GWSCAN_URL = 'https://www.gwscan.com'
/**
 * ckb decimals, used to format ckb balance
 */
export const CKB_DECIMALS = 8
/**
 * primary color to highlight message of discord bot
 */
export const PRIMARY_COLOR = '#E03C8A'
