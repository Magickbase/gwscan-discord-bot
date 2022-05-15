import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { config } from './config'
import * as cmds from './commands'

const rest = new REST({ version: '9' }).setToken(config.token!)
const commands = Object.values(cmds).map(c => c.data.toJSON())

rest.put(Routes.applicationGuildCommands(config.appId!, config.guildId!), { body: commands })
  .then(() => console.log("Deployed commands successfully"))
  .catch(console.error)


