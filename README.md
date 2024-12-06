# 🤖 NTNUI membership bot
A Discord bot designed to support NTNUI groups by managing and tracking users' membership statuses efficiently.

## 🔧 What is this made of?
This project leverages the [NTNUI API](https://api.ntnui.no/) to keep track of memberships, ensuring roles in Discord reflect current statuses.
The bot is built with:
- [discord.js](https://discord.js.org/) for Discord interaction.
- [Node.js](https://nodejs.org/en) as the runtime environment.
- [Sequelize](https://sequelize.org/) ORM with the lightweight and feature-rich [SQLite](https://www.sqlite.org/index.html) database engine for local data storage.

## 🚀 Quick Start and prerequisites
Make sure to have the latest version of git and Node installed.
1. Clone the repository

   ```bash
   git clone https://github.com/vegardev/ntnui-membership-bot.git
   cd ntnui-membership-bot/
   ```
2. Install dependencies

   ```bash
   npm install
   ```
3. Create a `config.json` with the following values:

   ```json
   {
    "token": "your-bot-token",
    "clientId": "your-bot-client-id",
    "guildId": "your-server-id"
   }
   ```
4. Run the bot 🎉

   ```bash
   node main.js
   ```

## 🗣️ Bot commands
|              Commands                |                                  Explanation                                   |            Required role           |
|--------------------------------------|--------------------------------------------------------------------------------|------------------------------------|
| `/register <phone_number>`           | Register the current Discord account to the NTNUI account with `<phone_number>`| Regular member                     |
| `/grant OR revoke <discord_username>`| Grants or revokes membership role to `<discord_username>`                      | 'Styret' (Board member)            |
| `/refresh`                           | Refresh the local database with up-to-date membership statuses.                | 'Styret' (Board member)            |

[![Bot in action](https://i.gyazo.com/92b7038b1ff71da85fb94ad222349e0f.gif)](https://gyazo.com/92b7038b1ff71da85fb94ad222349e0f)

## 🕴️Privacy &mdash; what data is being stored
Privacy is top priority.

This solution only stores **Discord user IDs** and **NTNUI IDs** as key-value pairs inside a local database.
To support the future reminder feature, a membership's **expiry date** is stored as well.

Contact us for any concerns or data removal requests at [qt@vegard.moe](mailto:qt@vegard.moe).

## 👯 Groups that use this bot
- [NTNUI Esport](https://discord.gg/ntnuiesport)

## 🛣️ Road map
- [ ] Have a bare bones, functioning bot.
- [ ] Successful integration of the NTNUI API. 
- [ ] Implement an automatic invitation feature for users not part of NTNUI.
- [ ] Implement a reminder for users 1 week ahead of group membership expiry.
- [ ] Full multi-language support.
- [ ] Provide detailed logs for administrators.

## 🙌 Contributing
Contributions are awesome! Please follow the steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to your branch (`git push origin feature-name`)
5. Open a pull request.

## 📝 License
This project is licensed under the GPL-3.0 license. See `LICENSE` for details.
