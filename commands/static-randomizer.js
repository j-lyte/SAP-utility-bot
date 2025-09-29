const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('static-randomizer')
    .setDescription('Returns a random static pack.')
    .addIntegerOption(option => option.setName('multiple')
      .setDescription('The number of packs to roll (default 1).')
      .setRequired(false)
      .setMinValue(2)
      .setMaxValue(9))
    .addStringOption(option => option.setName('custom-list')
                     .setDescription('Changes which packs are randomized. Use \"1234560\" or \"tpsgudw\" for Turtle, Puppy, ect.')
                     .setRequired(false)
      ),
  async execute(interaction) {
    let str = "Rolled pack";
    let multiple = interaction.options.getInteger('multiple');
    if (multiple != null) {
      str += 's';
    } else {
      multiple = 1;
    }
    let chances = [1.0 / 6, 2.0 / 6, 3.0 / 6, 4.0 / 6, 5.0 / 6, 1.0, 1.0];
    if(interaction.options.getString('custom-list') != null){
      chances = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      str += " (";
      let list = interaction.options.getString('custom-list');
      list.toLowerCase();
      let count = 0.0;
      if(list.includes('t')||list.includes('1')){
        str += "🟢";
        count++;
        chances[0] = count;
      }
      if(list.includes('p')||list.includes('2')){
        str += "🔵";
        count++;
        chances[1] = count;
      }
      if(list.includes('s')||list.includes('3')){
        str += "🔴";
        count++;
        chances[2] = count;
      }
      if(list.includes('g')||list.includes('4')){
        str += "🟡";
        count++;
        chances[3] = count;
      }
      if(list.includes('u')||list.includes('5')){
        str += "⚪";
        count++;
        chances[4] = count;
      }
      if(list.includes('d')||list.includes('6')){
        str += "⚫";
        count++;
        chances[5] = count;
      }
      if(list.includes('w')||list.includes('0')){
        str += ":calendar_spiral:";
        count++;
        chances[6] = count;
      }
      if(count==0){
        await interaction.reply({ content: "Custom list must contain at least one valid pack.", ephemeral: true });
        return;
      }
      for(let i = 0; i < 7; ++i){
        chances[i] /= count;
      }
      str += ")";
    }
    str += ': ';
    for (let i = 0; i < multiple; ++i) {
      if (multiple != 1) {
        str += '\n';
      }
      let r = Math.random()
      if (r < chances[0]) {
        str += "🟢 Turtle Pack";
      } else if (r < chances[1]) {
        str += "🔵 Puppy Pack";
      } else if (r < chances[2]) {
        str += "🔴 Star Pack";
      } else if (r < chances[3]) {
        str += "🟡 Golden Pack";
      } else if (r < chances[4]) {
        str += "⚪ Unicorn Pack";
      } else if (r < chances[5]) {
        str += "⚫ Danger Pack";
      } else {
        str += ":calendar_spiral: Weekly Pack";
      }
    }
    await interaction.reply({ content: str, ephemeral: false });
  },
};