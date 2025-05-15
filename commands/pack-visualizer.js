const { SlashCommandBuilder, Attachment } = require('discord.js');
const fs = require('node:fs');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pack-visualizer')
    .setDescription('Displays a pack.')
    .addStringOption(option => option.setName('pack-code').
      setDescription("The pack's json representation.")
      .setRequired(true))
    .addIntegerOption(option => option.setName('hue').
      setDescription("Bg-color for the pack.")
      .setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    let pool = JSON.parse(fs.readFileSync('commands/resources/pets.json', 'utf8'));
    const hue = interaction.options.getInteger('hue');
    let pack = {};
    try {
      pack = JSON.parse(interaction.options.getString('pack-code'));
      const canvas = createCanvas(1100, 600);
      const ctx = canvas.getContext('2d');
      let r = Math.floor(Math.random() * 360);
      if (hue != null && hue >= 0 && hue < 360) { r = hue; }
      ctx.fillStyle = `hsl(${r} 56% 64.5%)`;
      ctx.fillRect(0, 0, 1100, 600);
      ctx.fillStyle = `hsl(${r} 23.8% 49.6%)`;
      ctx.fillRect(25, 44 + 1 * 91, 1050, 4);
      ctx.fillRect(25, 44 + 2 * 91, 1050, 4);
      ctx.fillRect(25, 44 + 3 * 91, 1050, 4);
      ctx.fillRect(25, 44 + 4 * 91, 1050, 4);
      ctx.fillRect(25, 44 + 5 * 91, 1050, 4);
      ctx.font = "bold 42px Arial";
      ctx.fillStyle = "Black";
      ctx.fillText(pack["Title"], 105, 42);
      ctx.strokeStyle = "White";
      ctx.strokeText(pack["Title"], 105, 42)
      pool = JSON.parse(fs.readFileSync('commands/resources/pets.json', 'utf8'));
      for (let i = 0; i < 6; ++i) {
        const img = await loadImage('commands/resources/icons/dice/' + (i + 1) + '.png');
        ctx.drawImage(img, 31, 65 + i * 91, 50, 50);
        j = 0;
        for (pet of pool.pets[i]) {
          if (pack["Minions"].includes(pet)) {
            const img = await loadImage('commands/resources/icons/pets/' + pet + '.png');
            ctx.drawImage(img, 104 + 71 * j, 58 + i * 91, 67, 67);
            ++j
          }
        }
        if (i == 0) { ++j; }
        for (food of pool.food[i]) {
          if (pack["Spells"].includes(food)) {
            const img = await loadImage('commands/resources/icons/food/' + food + '.png');
            ctx.drawImage(img, 161 + 71 * j, 58 + i * 91, 67, 67);
            ++j;
          }
        }
      }
      let buffer = canvas.toBuffer('image/png');
      await interaction.editReply({ content: JSON.stringify(pack), files: [{ attachment: buffer, name: "pack.png" }], ephemeral: false });
    } catch (err) {
      await interaction.editReply({ content: "Pack code could not be parsed", ephemeral: false });
      console.log(err);
      return;
    }

  },
};