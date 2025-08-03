const { SlashCommandBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flips a coin.'),
	async execute(interaction) {
    let str = "<:turtle_defeated:1051603058976636928> tails"
    if(Math.random()>=0.5){
      str = "<:turtle_derpy:1051603071874125984> heads";
    }
		await interaction.reply({content:str, ephemeral:false});
	},
};