const { createServer } = require('http');
const server = createServer((req, res) => {
  res.writeHead(200);
  res.end('If you can read this, Manatee should be online.');
});
server.listen(3000);

const path = require('path');
const fs = require('node:fs');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Console } = require('console');
const token = process.env.Token;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]
});
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}
client.once(Events.ClientReady, () => {
  console.log('Ready!');
});

client.on("error", (err) => {
  console.log(err);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(token);
const { get } = require('https');
setInterval(() => get(`https://discord.com/api/v10/gateway`, ({ statusCode }) => {
  if (statusCode == 429) {
    console.log("Restarting for bad gateway.");
    get('https://sap-utility-bot.onrender.com');
    process.kill(1);
  }
}), 900000);