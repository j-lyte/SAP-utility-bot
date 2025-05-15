const { SlashCommandBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flips a coin.'),
	async execute(interaction) {
    let str = "https://cdn.discordapp.com/emojis/1051603058976636928.webp?size=96&quality=lossless"
    if(Math.random()>=0.5){
      str = "https://cdn.discordapp.com/emojis/1051603071874125984.webp?size=96&quality=lossless";
    }
		await interaction.reply({content:str, ephemeral:false});
	},
};