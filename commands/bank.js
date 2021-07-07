module.exports = {
	name: 'bank',
	description: 'Display\'s the bank\'s balance',
	usage: `bank`,
	command: true,
	aliases: ['bank', 'b'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
    reply(msg.channel.id, `The bank currently has ${floor(getUserBalance('bank'))}🦴(${getUserBalance('bank')}🦴)`, '#ffffba');
  }
};