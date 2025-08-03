const { SlashCommandBuilder, Attachment } = require('discord.js');
const fs = require('node:fs');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pack-randomizer')
    .setDescription('Returns a fully random pack.')
    .addStringOption(option => option.setName('title').
      setDescription("A name for the pack. Randomized by default")
      .setRequired(false))
    .addBooleanOption(option => option.setName('disable-puppy')
      .setDescription("Disables puppy pack.")
      .setRequired(false))
  .addBooleanOption(option => option.setName('disable-star')
    .setDescription("Disables star pack.")
    .setRequired(false))
  .addBooleanOption(option => option.setName('disable-golden')
    .setDescription("Disables golden pack.")
    .setRequired(false))
  .addBooleanOption(option => option.setName('disable-unicorn')
    .setDescription("Disables unicorn pack.")
    .setRequired(false))
  .addBooleanOption(option => option.setName('disable-danger')
    .setDescription("Disables danger pack.")
    .setRequired(false))
  .addBooleanOption(option => option.setName('disable-mini-set-1')
    .setDescription("Disables mini-set #1.")
    .setRequired(false))
  .addBooleanOption(option => option.setName('disable-mini-set-2')
    .setDescription("Disables mini-set #2.")
    .setRequired(false))
  .addBooleanOption(option => option.setName('disable-guaranteed-chocolate')
    .setDescription("Disables the guaranteed chocolate.")
    .setRequired(false)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    //let pool = JSON.parse(fs.readFileSync('commands/resources/pets.json', 'utf8'));
    let pack = {
      "Title": "",
      "Minion": 192,
      "Minions": [],
      "Spells": []
    };
    const title = interaction.options.getString('title');
    if (title != null) {
      pack["Title"] = title;
    }
    else {
      let names = JSON.parse(fs.readFileSync('commands/resources/names.json', 'utf8'));
      let r = Math.floor(Math.random() * names.adjectives.length);
      pack["Title"] += names.adjectives[r];
      r = Math.floor(Math.random() * names.nouns.length);
      pack["Title"] += " " + names.nouns[r];
    }
    let pool = {"pets":[[],[],[],[],[],[]],"food":[[],[],[],[],[],[]],"synergy":[]};
    let packs_enabled = [true, true, true, true, true, true, true, true];
    if (interaction.options.getBoolean('disable-puppy')) {
      packs_enabled[1] = false;
    }
    if (interaction.options.getBoolean('disable-star')) {
      packs_enabled[2] = false;
    } 
    if (interaction.options.getBoolean('disable-golden')) {
      packs_enabled[3] = false;
    }
    if (interaction.options.getBoolean('disable-unicorn')) {
      packs_enabled[4] = false;
    }
    if (interaction.options.getBoolean('disable-danger')) {
      packs_enabled[7] = false;
    }
    if (interaction.options.getBoolean('disable-mini-set-1')) {
      packs_enabled[5] = false;
    }
    if (interaction.options.getBoolean('disable-mini-set-2')) {
      packs_enabled[6] = false;
    }
    const food_data = JSON.parse(fs.readFileSync('commands/resources/Foods-.json', 'utf8'));
    const pet_data = JSON.parse(fs.readFileSync('commands/resources/Pets-.json', 'utf8'));
    for (let food_item of food_data){
      if (food_item.packs.some(p => packs_enabled[p-1])){
        pool.food[food_item.tier-1].push(food_item.id);
      }
    }
    for (let pet_item of pet_data){
      if (pet_item.packs.some(p => packs_enabled[p-1])){
        pool.pets[pet_item.tier-1].push(pet_item.id);
      }
    }
    for (let i = 0; i < 6; ++i) {
      for (let j = 0; j < 10; ++j) {
        let r = Math.floor(Math.random() * pool.pets[i].length);
        pack["Minions"].push(pool.pets[i][r]);
        pool.pets[i].splice(r, 1);
      }
      for (let j = 0; j < 3; ++j) {
        let r = Math.floor(Math.random() * pool.food[i].length);
        if (i == 4 && j == 0 && !interaction.options.getBoolean('disable-guaranteed-chocolate')){
          r = pool.food[i].indexOf(23);
        }
        pack["Spells"].push(pool.food[i][r]);
        pool.food[i].splice(r, 1);
      }
    }
    for (let syn of pool.synergy) {
      if (!(syn.enablers[0].some(e => pack["Minions"].includes(e)) || syn.enablers[1].some(e => pack["Spells"].includes(e)))) {
        for (let rem of syn.synergies[0]) {
          if (pack["Minions"].includes(rem[0])) {
            pack["Minions"].splice(pack["Minions"].indexOf(rem[0]), 1);
            let r = Math.floor(Math.random() * pool.pets[rem[1]].length);
            pack["Minions"].push(pool.pets[rem[1]][r]);
            pool.pets[rem[1]].splice(r, 1);
          } else {
            pool.pets[rem[1]].splice(pool.pets[rem[1]].indexOf(rem[0]), 1);
          }
        }
        for (let rem of syn.synergies[1]) {
          if (pack["Spells"].includes(rem[0])) {
            pack["Spells"].splice(pack["Spells"].indexOf(rem[0]), 1);
            let r = Math.floor(Math.random() * pool.food[rem[1]].length);
            pack["Spells"].push(pool.food[rem[1]][r]);
            pool.food[rem[1]].splice(r, 1);
          } else {
            pool.food[rem[1]].splice(pool.food[rem[1]].indexOf(rem[0]), 1);
          }
        }
      }
    }

    const canvas = createCanvas(1100, 600);
    const ctx = canvas.getContext('2d');
    const r = Math.floor(Math.random() * 360);
    ctx.fillStyle = `hsl(${r} 100% 10%)`;
    ctx.fillRect(0, 0, 1100, 600);
    ctx.fillStyle = `hsl(${r} 100% 24%)`;
    ctx.fillRect(25, 44 + 1 * 91, 1050, 4);
    ctx.fillRect(25, 44 + 2 * 91, 1050, 4);
    ctx.fillRect(25, 44 + 3 * 91, 1050, 4);
    ctx.fillRect(25, 44 + 4 * 91, 1050, 4);
    ctx.fillRect(25, 44 + 5 * 91, 1050, 4);
    ctx.font = "bold 42px Arial";
    ctx.fillStyle = "White";
    ctx.fillText(pack["Title"], 105, 42);
    ctx.strokeStyle = "Black";
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
  },
};