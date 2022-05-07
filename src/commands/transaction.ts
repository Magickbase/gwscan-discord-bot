import { CacheType, CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { gql } from 'graphql-request'
import { client } from '../client'
import { formatValue } from '../utils'
import { LOGO_URL, GWSCAN_URL, CKB_DECIMALS } from '../config'

const query = gql`
    query ($hash: String!) {
      transaction(input: { transaction_hash: $hash }) {
        hash
        from_account {
          eth_address
        }
        to_account {
          eth_address
        }
        type
        polyjuice {
          value
          status
          input
        }
        block {
          number
          hash
          timestamp
          status
        }
      }
    }
  `

export const data = new SlashCommandBuilder()
  .setName('transaction')
  .setDescription('Replies transaction info')
  .addStringOption(option =>
    option.setName('hash')
      .setDescription('Transaction hash')
      .setRequired(true))

export const execute = async (intereaction: CommandInteraction<CacheType>) => {
  const hash = intereaction.options.getString('hash')
  const { transaction } = await client.request(query, { hash })

  if (!transaction) return intereaction.reply({ content: `Transaction "${hash}" not found`, ephemeral: true })

  const fields = [
    { name: 'From', value: transaction.from_account.eth_address },
    { name: 'To', value: transaction.to_account.eth_address },
    transaction.polyjuice ? { name: 'Value', value: formatValue(transaction.polyjuice.value ?? '0', CKB_DECIMALS, 'CKB') } : null,
    transaction.polyjuice ? { name: 'Tx Status', value: transaction.polyjuice.status } : null,
    { name: 'Block', value: `${transaction.block?.number ?? '-'}` },
    { name: 'Block Status', value: transaction.block?.status ?? '-' },
    { name: "Time", value: transaction.block?.timestamp ?? '-' },
  ].filter(v => v) as Array<EmbedFieldData>

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setImage(LOGO_URL)
    .setThumbnail(LOGO_URL)
    .setTitle(`${transaction.type} Transaction\n ${transaction.hash}`)
    .setURL(`${GWSCAN_URL}/tx/${transaction.hash}`)
    .addFields(...fields)
    .setTimestamp()

  return intereaction.reply({ embeds: [embed] })
}
