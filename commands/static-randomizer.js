const { SlashCommandBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('static-randomizer')
		.setDescription('Returns a random static pack.')
    .addStringOption(option => option.setName('options')
                     .setDescription('Changes how packs are randomized.')
                     .setRequired(false)
                     .addChoices(
                        {name:'no_turtle',value:"no_turtle"},
                        {name:'no_puppy',value:"no_puppy"},
                        {name:'no_star',value:"no_star"},
                        {name:'no_golden',value:"no_golden"},
                        {name:'boring_packs_only',value:"turtle_or_star"},
                        {name:'cool_packs_only',value:"puppy_or_golden"},
                        {name:'free_to_play',value:"free_to_play"})
      ),
	async execute(interaction) {
    let str = "Rolled pack";
    let chances = [0.25,0.5,0.75,1];
    let mod = interaction.options.getString('options');
    if(mod=="no_golden"){
      chances=[0.334,0.667,1,1];
      str+=' (no golden)';
    } else if(mod=="no_puppy"){
      chances=[0.334,0.334,0.667,1];
      str+=' (no puppy)';
    } else if(mod=="no_turtle"){
      chances=[0,0.334,0.667,1];
      str+=' (no turtle)';
    } else if(mod=="no_star"){
      chances=[0.334,0.667,0.667,1];
      str+=' (no star)';
    } else if(mod=="turtle_or_star"){
      chances=[0.5,0.5,1,1];
      str+=' (turtle or star)';
    } else if(mod=="puppy_or_golden"){
      chances=[0,0.5,0.5,1];
      str+=' (puppy_or_golden)';
    } else if(mod=="free_to_play"){
      chances=[1,1,1,1];
      str+=' (free_to_play)';
    }
    str += ': ';
    let r = Math.random()
    if(r<chances[0]){
      str += "Turtle Pack";
    } else if(r<chances[1]){
      str += "Puppy Pack";
    } else if(r<chances[2]){
      str += "Star Pack";
    } else{
      str += "Golden Pack";
    }
		await interaction.reply({content:str, ephemeral:false});
	},
};