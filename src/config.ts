import 'dotenv/config'

export const config = {
  token: process.env.DISCORD_TOKEN,
  publicKey: process.env.PUBLIC_KEY,
  server: process.env.SERVER,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
}

export const LOGO_URL = 'https://www.gwscan.com/icons/nervina-logo.svg'
export const GWSCAN_URL = 'https://www.gwscan.com'
export const CKB_DECIMALS = 8
