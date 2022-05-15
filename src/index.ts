import { Client, Intents, Collection, CommandInteraction, CacheType } from 'discord.js'
import { config } from './config'
import * as cmds from './commands'
import { SlashCommandBuilder } from '@discordjs/builders'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
  console.log('Ready')
})

const commands = new Collection<string, { data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">, execute: (i: CommandInteraction<CacheType>) => Promise<void> }>()

// cache all commands and their callback in `commands` map
Object.entries(cmds).forEach(([name, value]) => commands.set(name, value))

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  const command = commands.get(interaction.commandName)
  if (!command) return

  try {
    // handle requests from users
    await command.execute(interaction)
  } catch (err) {
    console.error(err)
    await interaction.reply({
      content: `There was an error on executing this command`, ephemeral: true
    })
  }
})




client.login(config.token)
