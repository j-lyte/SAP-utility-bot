const { SlashCommandBuilder, Attachment } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scrape')
		.setDescription('Returns the reactions of the last few messages')
    .addIntegerOption(option =>
		  option.setName('depth')
			  .setDescription('The amount of past messages to scan.')
        .setRequired(true)
        .setMinValue(1)),
	async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const depth = interaction.options.getInteger('depth');
    let messages = await interaction.channel.messages.fetch({limit:depth,cache:false});
    let csv_data = [];
    for(let msg of messages.reverse().values()){
      for(let reaction of msg.reactions.cache.values()){
        let column = [];
        column.push(msg.content.replace(/\r?\n|\r/g,' '));
        column.push(reaction.emoji.name);
        let users = await reaction.users.fetch();
        for(let user of users.values()){
          column.push(user.username);
        }
        csv_data.push(column);
      }
    }
    let reply = '';
    let done = false;
    for(let i = 0;!done;++i){
      let line = '';
      done = true;
      for(let j=0;j<csv_data.length;++j){
        if(i<csv_data[j].length){
          line+=csv_data[j][i];
          done = false;
        }
        if(j<csv_data.length-1){
          line+=',';
        }
      }
      if(!done){
        reply+='\n'+line;
      }
    }
    let buffer = Buffer.from(reply,'utf8');
		await interaction.editReply({content:"Here it is.", files: [{attachment:buffer,name:"scrape.csv"}], ephemeral:true});
	},
};