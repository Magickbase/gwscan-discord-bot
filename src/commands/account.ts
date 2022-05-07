import { CacheType, CommandInteraction, MessageEmbed } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { gql } from 'graphql-request'
import { client } from '../client'
import { formatValue } from '../utils'
import { LOGO_URL, GWSCAN_URL } from '../config'

const query = gql`
    query($address: String!) {
      account(input: {address: $address}) {
        id
        eth_address
        type
        transaction_count
        token_transfer_count
        nonce
        account_udts {
          balance
          udt {
            id
            icon
            decimal
            name
            type
            symbol
          }
        }
      }
    }
  `

export const data = new SlashCommandBuilder()
  .setName('account')
  .setDescription('Replies account info')
  .addStringOption(option =>
    option.setName('address')
      .setDescription('Account eth address')
      .setRequired(true))

export const execute = async (intereaction: CommandInteraction<CacheType>) => {
  const address = intereaction.options.getString('address')
  const { account } = await client.request(query, { address })

  if (!account) return intereaction.reply({ content: `Account "${address}" not found`, ephemeral: true })

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setImage(LOGO_URL)
    .setThumbnail(LOGO_URL)
    .setTitle(`${account.type} ${account.eth_address}`)
    .setURL(`${GWSCAN_URL}/address/${account.eth_address}`)
    .addFields(
      account.account_udts.map((u: any) => ({
        name: u.udt.name,
        value: formatValue(u.balance, u.udt?.decimal, u.udt?.symbol),
        inline: true,
      }))
    )
    .setTimestamp()

  return intereaction.reply({ embeds: [embed], ephemeral: true })
}
