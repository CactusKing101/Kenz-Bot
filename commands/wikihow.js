const { MessageEmbed } = require("discord.js");
const jsdom = require("jsdom");
const request = require('request');
module.exports = {
  name: 'wikihow',
  description: 'Retrieves a random WikiHow image',
  usage: `wikihow`,
  command: true,
  aliases: ['wikihow'],
  execute(client, msg, args, reply) {
    request('http://www.wikihow.com/Special:Randomizer', { json: false }, (err, res, body) => {
      if (err) console.warn(err);
      const dom = new jsdom.JSDOM(body);
      reply(msg.channel.id, dom.window.document.querySelector("title").textContent);
      console.log(dom.window.document.querySelector("img").textContent);
    });
  }
};