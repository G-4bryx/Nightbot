const { model, Schema } = require("mongoose");

let moderationSchema = new Schema({
    GuildID: String,
    MultiGuildedID: Boolean, // Level 2
    MuteRoleID: String,
    LogChannelID: String,
}, { strict: false });

module.exports = model("moderation", moderationSchema);