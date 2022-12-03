const Discord = require("discord.js");
const axios = require('axios')
const client = new Discord.Client({ intents: 32767 });
const config = require('./config.json');
const colors = require('colors')

/**
 * @param {Discord.Message} message
 */

client.on("ready", async(message) => {
    console.log(colors.blue('[#] Bot iniciado com sucesso, update sendo realizado dentro de segundos.'))

    var data = { players: "" }

    async function message() {

        async function update_info() {

            await axios.get(`http://${config.ip}:${config.porta}/players.json`).then(response => {
                console.log(colors.green('[+] Update realizado com sucesso.'))
                data.players = response.data.length
            }).catch(err => data.players = -1)
        }

        await update_info()

        await client.channels.cache.get(config.Canal).bulkDelete(100).catch(() => console.error)

        if (data.players === -1) {
            var embed = new Discord.MessageEmbed()

            .setColor('#2f3136')
                .setTitle('Para conectar no servidor clique nos botões a baixo.')
                .addField(`Players:`, `\`\`\`ini\n [ 0/250 ] \`\`\``, true)
                .addField('**Status:**', '```Bash\n"🔴 Offline "```', true)
                .addField('**IP Servidor:**', `\`\`\`${config.ip2}\`\`\``, false)
                .addField('**TeamSpeak**:', `\`\`\`${config.ts3}\`\`\``, false)
                .setThumbnail(config.Logo)

        } else {
            var embed = new Discord.MessageEmbed()

            .setTitle('Utilize os links para acessar o servidor.')
                .setColor('#2f3136')
                .addField(`Players:`, `\`\`\`ini\n [ ${data.players}/250 ] \`\`\``, true)
                .addField('**Status:**', '```Bash\n"🟢 Online "```', true)
                .addField('**IP Servidor:**', `\`\`\`${config.ip2}\`\`\``, false)
                .addField('**TeamSpeak**:', `\`\`\`${config.ts3}\`\`\``, false)
                .setThumbnail(config.Logo)

        }

        const cfx = new Discord.MessageButton()

        .setStyle("LINK")
            .setLabel(`FiveM`)
            .setEmoji('878251971021246465')
            .setURL(config.CFX.url)

        const ts = new Discord.MessageButton()

        .setStyle("LINK")
            .setLabel(`TeamSpeak3`)
            .setEmoji('878251970895429693')
            .setURL(config.TS3.url)

        const row = new Discord.MessageActionRow().addComponents([cfx, ts])

        await client.channels.cache.get(config.Canal).send({
            components: [row],
            embeds: [embed]
        }).then(msg => {

            setInterval(async() => {
                if (data.players === -1) {
                    embed.fields[0].value = `\`\`\`ini\n [ 0/250 ] \`\`\``
                    embed.fields[1].value = `\`\`\`Bash\n "🔴 Offline " \`\`\``
                    msg.edit({ embeds: [embed] })
                } else {
                    embed.fields[0].value = `\`\`\`ini\n [ ${data.players}/250 ] \`\`\``
                    embed.fields[1].value = `\`\`\`Bash\n "🟢 Online " \`\`\``
                    msg.edit({ embeds: [embed] })
                }
                async function update_info() {
                    await axios.get(`http://${config.ip}:${config.porta}/players.json`).then(response => {
                        console.log(colors.green('[+] Update realizado com sucesso.'))
                        data.players = response.data.length
                    }).catch(err => data.players = -1)
                }
                await update_info()
            }, 15000);
        })
    }
    message()
})

client.login(config.token);
