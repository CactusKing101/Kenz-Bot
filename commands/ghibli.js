const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'ghibli',
	description: 'Send a Ghibli Studio menu',
	usage: `ghibli`,
	command: false,
  slash: true,
  options: [],
  executeI(client, interaction) {
    if (interaction.user.id != '473110112844644372') return
    request('https://ghibliapi.herokuapp.com/films', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body[0].title).setDescription(body[0].description).setAuthor(body[0].director) ], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId('films_1').setLabel('Next').setStyle('PRIMARY'))] });
    });
  },
  button: true,
  buttonId: '_',
  executeB(client, interaction) {
    if (interaction.user.id != '473110112844644372') return;
    var split = interaction.customId.split('_');
    split[1] = Number(split[1]);
    if (split[0] == 'films') {
      request('https://ghibliapi.herokuapp.com/films', { json: true }, (err, res, body) => {
        if (split[1] + 1 > body.length) interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body[split[1]].title).setDescription(body[split[1]].description).setAuthor(body[split[1]].director) ], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_${split[1] - 1}`).setLabel('Back').setStyle('PRIMARY'))] });
        else if (split[1] == 0) interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body[0].title).setDescription(body[0].description).setAuthor(body[0].director) ], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId('films_1').setLabel('Next').setStyle('PRIMARY'))] });
        else interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body[split[1]].title).setDescription(body[split[1]].description).setAuthor(body[split[1]].director) ], components: [new MessageActionRow().addComponents([new MessageButton().setCustomId(`films_${split[1] - 1}`).setLabel('Back').setStyle('PRIMARY'), new MessageButton().setCustomId(`films_${split[1] + 1}`).setLabel('Next').setStyle('PRIMARY')])] });
      });
    }
  }
};