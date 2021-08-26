const { MessageEmbed } = require('discord.js');
const config = require('../general/config.json');
const prefix = config.prefix;
module.exports = {
	name: 'buy',
	description: 'Allows you to buy items from the shop',
	usage: `buy <item>`,
	command: false,
	slash: true,
	options: [
		{
			name: 'items',
			description: 'What you want to buy',
			required: true,
			type: 'STRING',
			choices: [
				{
					name: 'Vip',
					value: 'vip'
				},
				{
					name: 'DJ',
					value: 'dj'
				},
				{
					name: 'Keycard',
					value: 'keycard'
				},
				{
					name: 'Mathematics',
					value: 'mathematics'
				},
				{
					name: 'Hue',
					value: 'hue'
				},
				{
					name: 'Flag',
					value: 'flag'
				}
			]
		}
	],
	executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
		const balance = getUserBalance(interaction.user.id);

		for (let i = 0; i < config.shop.length; ++i) {
			if (interaction.options.getString('items') == config.shop[i][1]) {
				const role = interaction.guild.roles.cache.get(config.shop[i][3]);

				if (config.shop[i][4] == 0) {
					if (interaction.member.roles.cache.has(config.shop[i][3])) {
						interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You already have ${role} you dumb`).setColor('#9e9d9d') ] });
						break;
					}
					if (balance < config.shop[i][2]) {
						interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You don't have enough funds for the ${role} role\nYou need ${config.shop[i][2]}🦴\nYou have ${balance}🦴`).setColor('#9e9d9d') ] });
						break;
					}
					interaction.member.roles.add(role, `Bought ${role.name}`);
					log('830503210951245865', `-${config.shop[i][2]}🦴 to ${interaction.user} for buying ${role}`, '#ff7784');
					interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You spent ${config.shop[i][2]}🦴\n${interaction.user}, you now have ${role}`).setColor('#9e9d9d') ] });
				} else {
					if (!interaction.member.roles.cache.has(config.shop[i][3])) {
						interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You don't have ${role} you dumb`).setColor('#9e9d9d') ] });
						break;
					}
					if (balance < config.shop[i][2]) {
						interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You don't have enough funds for the ${role} role\nYou need ${config.shop[i][2]}🦴\nYou have ${balance}🦴`).setColor('#9e9d9d') ] });
						break;
					}
					interaction.member.roles.remove(role, `Paid to remove ${role.name}`);
					log('830503210951245865', `-${config.shop[i][2]}🦴 to ${interaction.user} for removing ${role}`, '#ff7784');
					interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You spent ${config.shop[i][2]}🦴\n${interaction.user}, you now have removed ${role}`).setColor('#9e9d9d') ] });
				}
				addUserBalance(interaction.user.id, -config.shop[i][2]);
				addUserBalance('bank', config.shop[i][2]);
				break;
			}
		}
	}
};