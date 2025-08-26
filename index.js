import express from "express";
import { Client, GatewayIntentBits } from "discord.js";
import { joinVoiceChannel, getVoiceConnection } from "@discordjs/voice";

const app = express();
app.use(express.json());

// Ses kanalına katılma
app.post("/join", async (req, res) => {
  const { token, guildId, channelId } = req.body;

  if (!token || !guildId || !channelId) {
    return res.status(400).send("Eksik parametre: token, guildId, channelId gerekli.");
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
  });

  client.once("ready", async () => {
    try {
      const guild = await client.guilds.fetch(guildId);
      const channel = await guild.channels.fetch(channelId);

      if (!channel || channel.type !== 2) {
        res.status(400).send("Geçerli bir ses kanalı bulunamadı.");
        client.destroy();
        return;
      }

      joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      res.send(`✅ Bot ${channel.name} kanalına katıldı`);
    } catch (err) {
      res.status(500).send("❌ Hata: " + err.message);
    }
  });

  client.login(token).catch(() => {
    res.status(401).send("❌ Bot token geçersiz.");
  });
});

// Ses kanalından çıkma
app.post("/leave", async (req, res) => {
  const { guildId } = req.body;
  if (!guildId) return res.status(400).send("guildId gerekli.");

  const connection = getVoiceConnection(guildId);
  if (connection) {
    connection.destroy();
    return res.send("👋 Bot ses kanalından ayrıldı.");
  } else {
    return res.status(404).send("Bot zaten ses kanalında değil.");
  }
});

app.listen(3000, () => console.log("🚀 Discord Voice API çalışıyor (port 3000)"));
