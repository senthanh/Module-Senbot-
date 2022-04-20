module.exports.config = {
    name: "avtlol",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SenProject",//TDUNG
    description: "ẢNH NỀN LOL",
    group: "GAME",
    usages: "",
    cooldowns: 5
}
module.exports.run = async function ({ api, event, args}) {
    const { threadID, messageID, senderID, body } = event;
    const axios = require("axios");
    const fs = require("fs-extra");
    const qs = require("querystring");
    const moduleName = this.config.name;
    var info = await api.getUserInfo(event.senderID);
    var nameSender = info[event.senderID].name;
    let text = args.join(" ")
    let params = {text};
    params = qs.stringify(params);
    api.sendMessage("Đang khởi tạo hình ảnh, vui lòng chờ đợi...", event.threadID, event.messageID);
    const pathsave = __dirname + `/cache/avtlolv2.png`;
    let imageBuffer;
await axios.get(`https://api.lolhuman.xyz/api/ephoto1/lolbanner?apikey=b229f3dc257deae3030fe409&text=${text}`, {
            responseType: "arraybuffer"
        })
        .then(data => {
            const imageBuffer = data.data;
            fs.writeFileSync(pathsave, Buffer.from(imageBuffer));
            api.sendMessage({body: `[SENPROJECT_R05] - Module: ${moduleName} || Tên: ${nameSender}  || - Text: ${text}`, attachment: fs.createReadStream(pathsave)}, event.threadID, () => fs.unlinkSync(pathsave), event.messageID);})
        .catch(error => {
            let err;
            if (error.response) err = JSON.parse(error.response.data.toString());
            else err = error;
            return api.sendMessage(`Đã xảy ra lỗi ${err.error} ${err.message}`, event.threadID, event.messageID);
        })
};
