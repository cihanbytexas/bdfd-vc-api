# bdfd-vc-# Discord Voice API

Herkesin kendi botunu sese sokabilmesi için hazırlanmış basit bir köprü API.

### Kullanım
- `/join` endpoint: Botu ses kanalına sokar.
- `/leave` endpoint: Botu bulunduğu ses kanalından çıkarır.

### Örnek İstek
```http
POST /join
Content-Type: application/json

{
  "token": "KULLANICI_BOT_TOKEN",
  "guildId": "1234567890",
  "channelId": "0987654321"
}
