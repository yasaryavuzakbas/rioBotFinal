const { Client, Intents } = require('discord.js');
const { z } = require('zod');

global.client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
    // disableMentions: 'everyone',
});

client.config = require('./config');

client.on("ready", async msg => {
    console.log('Logged in');
    const channel= client.channels.cache.get("908693709393113091")
    
  })

  client.login(client.config.token);