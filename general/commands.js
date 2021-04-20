const Discord = require('discord.js');
const config = require('./config.json');
const prefix = config.prefix;

const dmCommands = (client = Discord.Client, msg = Discord.Message) => {
  if (msg.channel.type == 'dm') {
    const guild = client.guilds.cache.get('830495072876494879');
    const member = guild.members.cache.get(msg.author.id);

    if (!member.roles.cache.get('830496065366130709')) return msg.channel.send('Sorry only owners can run core commands!');

    if (msg.content == '!update') {
      client.user.setAvatar(guild.iconURL());
      msg.channel.send('Ran the following updates\nPfP');
    }
  }
};

const announcements = (client = Discord.Client,msg = Discord.Message) => {
  const announcementChannel = client.channels.cache.get('830506698908893235');
  const eventChannel = client.channels.cache.get('830506718164287498');
  if (msg.channel.id == '830503569622827069' && msg.content.includes('!announce!')) {
    if (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') return;
    msg.channel.send(`Is this announcement ok? (Respond yes or no)\n${msg.content.replace('!announce!', '')}`)
      .then(async () => {
        const filter = m => m.author.id == msg.author.id;
        msg.channel.awaitMessages(filter, {max: 1, time: 15000, errors: ['time']})
          .then(async collected => {
            
            if (collected.first().content.toLowerCase().includes('yes')) {
              try {
                const webhooks = await announcementChannel.fetchWebhooks();
                const webhook = webhooks.first();
                
                if (webhook == null) return msg.channel.send('Error:\nNo webhooks found!');
                await webhook.send(msg.content.replace('!announce!',''), {
                  username: msg.guild.name,
                  avatarURL: msg.guild.iconURL(),
                  embeds: [],
                });
              } catch (error) {
                console.warn(error);
              }
            } else {
              msg.channel.send('Announcement canceled!');
            }
          }).catch(() => {
            msg.channel.send('No response :(');
          });
      });
  }
  if (msg.channel.id == '830503569622827069' && msg.content.includes('!event!')) {
    if (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') return;
    msg.channel.send(`Is this event ok? (Respond yes or no)\n${msg.content.replace('!event!', '')}`)
      .then(async () => {
        const filter = m => m.author.id == msg.author.id;
        msg.channel.awaitMessages(filter, {max: 1, time: 15000, errors: ['time']})
          .then(async collected => {
            
            if (collected.first().content.toLowerCase().includes('yes')) {
              try {
                const webhooks = await eventChannel.fetchWebhooks();
                const webhook = webhooks.first();
                
                if (webhook == null) return msg.channel.send('Error:\nNo webhooks found!');
                await webhook.send(msg.content.replace('!event!',''), {
                  username: msg.guild.name,
                  avatarURL: msg.guild.iconURL(),
                  embeds: [],
                });
              } catch (error) {
                console.warn(error);
              }
            } else {
              msg.channel.send('Event canceled!');
            }
          }).catch(() => {
            msg.channel.send('No response :(');
          });
      });
  }
};

const help = (msg = Discord.Message, reply) => {
  let description = '';
  for(let i = 0; i < config.help.length; ++i) {
    description += `\n${prefix}${config.help[i]}`;
  }
  var embed = new Discord.MessageEmbed().setDescription(description).setColor('#ffffba');
  msg.author.send(embed)
    .catch(() => {
      reply(msg.channel.id, description, '#ffffba')
    });
  reply(msg.channel.id, 'You got mail! :mailbox_with_mail:', '#9e9d9d'); 
};

const income = (reply) => {
  reply(msg.channel.id, `Ok this is a quick explanation on how points are made on this server. As of when the server first started the two ways to make points goes as follows:\n1. You can make +5🍰 points per minute of messaging. This use's a cooldown system that starts a 1 minute cooldown on point gain.\n2. Spending 1 minute in vc will give you +2🍰 points. If you are not muted you will instead get a total of +5🍰 points. If you are not muted and use camera you will get a total +8🍰 points. If you can not use your camera you can instead screenshare while unmuted to get a total of +6🍰 points.\n3. also events may give points :D`, '#ffffba');
};

const balance = (msg = Discord.Message, reply, currency = Discord.Collection) => {
  const target = msg.mentions.users.first() || msg.author;
  return reply(msg.channel.id, `${target.tag} has ${currency.getBalance(target.id)}🍰`, '#ffffba');
};

const gamble = async (client = Discord.Client, msg = Discord.Message, reply, log, currency = Discord.Collection) => {
  if (args[0] == 'help') return reply(msg.channel.id, 'Spend some 🍰 to earn some 🍰\nMinimal gamble amount: 500🍰\nPayout table: (:teddy_bear:= not 💎 / :space_invader:)\n💎 💎 💎 - 25x\n💎 💎 ❓ - 5x\n:teddy_bear: :teddy_bear: :teddy_bear: - 10x\n:teddy_bear: :teddy_bear: ❓ - 2x\n:space_invader: ❓ ❓ - 0x (cancels any winning)\n❓ ❓ ❓ - 0x', '#9e9d9d');
  const balance = await currency.getBalance(msg.author.id);
  const bank = await currency.getBalance('bank');
  var bet = 0;

  if (args[0] == 'all') bet = balance;
  else if (!isNaN(args[0]) && Math.floor(args[0]) >= 500) bet = Math.floor(args[0]);
  else return reply(msg.channel.id, `Hey sorry but you need to use the command like this ${prefix}gamble <all \\|\\| number \\|\\| help>\nMinimal gamble amount is 500🍰`, '#9e9d9d');
  
  if (bet > balance || bet < 500) return reply(msg.channel.id, `Not enough funds! Your balance is ${balance}🍰 You need at least 500🍰`, '#9e9d9d');
  var slot1 = Math.floor(Math.random() * config.emojis.length);
  var slot2 = Math.floor(Math.random() * config.emojis.length);
  var slot3 = Math.floor(Math.random() * config.emojis.length);
  const diamond = config.emojis.length - 1;
  let total = 0;
  
  if (slot1 == diamond && slot2 == diamond && slot3 == diamond) total = bet * 25;
  else if (slot1 == diamond && slot2 == diamond || slot1 == diamond && slot3 == diamond || slot2 == diamond && slot3 == diamond) total = bet * 5;
  else if (slot1 == slot2 && slot2 == slot3) total = bet * 10;
  else if (slot1 == slot2 || slot1 == slot3 || slot2 == slot3) total = bet * 2;
  
  if (slot1 == 0 || slot2 == 0 || slot3 == 0) total = 0;
  let outcome = total - bet;
  await currency.addBalance(msg.author.id, outcome);
  await currency.addBalance('bank', -outcome);
  var embed = new Discord.MessageEmbed()
    .setTitle(`Slot Machine results: ${config.emojis[slot1]} ${config.emojis[slot2]} ${config.emojis[slot3]}`)
    .setFooter(`Use *${prefix}gamble help* for an explanation on the slot machine`);
  
  if (total > 0) {
    embed.setColor('#baffc9')
      .setDescription(`You Spent: ${bet}🍰\nYou made: ${total}🍰 (${balance + outcome}🍰)\n${outcome}🍰 points taken from the bank(${bank + -outcome}🍰)`);
    log('830503210951245865', `+${outcome}🍰 to ${msg.author} from gambling ${bet}🍰`, '#baffc9');
  } else {
    embed.setColor('#ff7784')
      .setDescription(`You Spent: ${bet}🍰\nYou Made: ${total}🍰 (${balance + outcome}🍰)\n${-outcome}🍰 points added to the bank(${bank + -outcome}🍰)`);
    log('830503210951245865', `-${-outcome}🍰 to ${msg.author} from gambling ${bet}🍰`, '#ff7784');
  }
  msg.channel.send(embed);
}

const bank = async (msg = Discord.Message, reply, currency = Discord.Collection) => {
  reply(msg.channel.id, `The bank currently has ${await currency.getBalance('bank')}🍰`, '#ffffba');
}

const add = (msg = Discord.Message, reply, log, currency = Discord.Collection) => {
  if (msg.member.roles.cache.has('830496065366130709')) {
    const target = msg.mentions.users.first() || msg.author;

    if (isNaN(args[0])) return reply(msg.channel.id, `Sorry you need to use the command like this ${prefix}add <amount> [@User]`, '#9e9d9d');
    const amount = Math.floor(args[0]);
    const balance = currency.getBalance(target.id);
    currency.addBalance(target.id, amount);
    currency.addBalance('bank', -amount);
    reply(msg.channel.id, `Given ${amount}🍰 to ${target}\nThey now have ${balance + amount}🍰`, '#baffc9');
    log('830503210951245865', `+${amount}🍰 to ${target} given by ${msg.author}`, '#baffc9');
  } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
}

const remove = (msg = Discord.Message, reply, log, currency = Discord.Collection) => {
  if (msg.member.roles.cache.has('830496065366130709')) {
    const target = msg.mentions.users.first() || msg.author;

    if (isNaN(args[0])) return reply(msg.channel.id, `Sorry you need to use the command like this ${prefix}remove <amount> [@User]`, '#9e9d9d');
    const amount = Math.floor(args[0]);
    const balance = currency.getBalance(target.id);
    currency.addBalance(target.id, -amount);
    currency.addBalance('bank', amount);
    reply(msg.channel.id, `Taken ${amount}🍰 from ${target}\nThey now have ${balance - amount}🍰`, '#ff7784');
    log('830503210951245865', `-${amount}🍰 to ${target} taken by ${msg.author}`, '#ff7784');
  } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
}

exports.dmCommands = dmCommands;
exports.announcements = announcements;
exports.help = help;
exports.income = income;
exports.balance = balance;
exports.gamble = gamble;
exports.bank = bank;
exports.add = add;
exports.remove = remove;