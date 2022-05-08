import { CacheType, CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { gql } from 'graphql-request'
import { client } from '../client'
import { formatValue } from '../utils'
import { LOGO_URL, GWSCAN_URL, CKB_DECIMALS, PRIMARY_COLOR } from '../config'

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

      token_transfers(input: { transaction_hash: $hash }) {
        amount
        from_address_hash
        to_address_hash
        udt {
          id
					decimal
          symbol
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
  const { transaction, token_transfers } = await client.request(query, { hash })

  if (!transaction) return intereaction.reply({ content: `Transaction "${hash}" not found`, ephemeral: true })

  const fields = [
    { name: 'From', value: transaction.from_account.eth_address },
    { name: 'To', value: transaction.to_account.eth_address },
    transaction.polyjuice ? { name: 'Value', value: formatValue(transaction.polyjuice.value ?? '0', CKB_DECIMALS, 'CKB') } : null,
    transaction.polyjuice ? { name: 'Tx Status', value: transaction.polyjuice.status } : null,
    { name: 'Block', value: `${transaction.block?.number ?? '-'}` },
    { name: 'Block Status', value: transaction.block?.status ?? '-' },
    { name: "Time", value: transaction.block?.timestamp ? new Date(transaction.block.timestamp).toUTCString() : '-' },
  ].filter(v => v) as Array<EmbedFieldData>

  const embeds = [new MessageEmbed()
    .setColor(PRIMARY_COLOR)
    .setImage(LOGO_URL)
    .setThumbnail(LOGO_URL)
    .setTitle(`${transaction.type} Transaction\n ${transaction.hash}`)
    .setURL(`${GWSCAN_URL}/tx/${transaction.hash}`)
    .addFields(...fields),

  ...(token_transfers.map((t: any) => (
    new MessageEmbed()
      .setColor(PRIMARY_COLOR)
      .setTitle(`Transfer ${formatValue(t.amount, t.udt?.decimal, t.udt?.symbol)}`)
      .setFields(
        { name: 'From', value: t.from_address_hash ? `[${t.from_address_hash}](${GWSCAN_URL}/address/${t.from_address_hash})` : '-' },
        { name: 'To', value: t.to_address_hash ? `[${t.to_address_hash}](${GWSCAN_URL}/address/${t.to_address_hash})` : '-' }
      )
  )))
  ]

  return intereaction.reply({ embeds })
}
