module.exports.config = {
	name: "fbcover", 
	version: "1.0.0", 
	hasPermssion: 0, 
	credits: "DungUwU", 
	description: "blah blah blha", 
	group: "image",
	usages: "",
	cooldowns: 5
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
	const { threadID, messageID, senderID, body } = event;
	if (handleReply.content.id != senderID) return;
	const input = body.trim();
	const sendC = (msg, step, content) => api.sendMessage(msg, threadID, (err, info) => {
		global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
		api.unsendMessage(handleReply.messageID);
		global.client.handleReply.push({
			step: step,
			name: this.config.name,
			messageID: info.messageID,
			content: content
		})
	}, messageID);
	const send = async (msg) => api.sendMessage(msg, threadID, messageID);

	let content = handleReply.content;
	switch (handleReply.step) {
		case 1:
			content.nhanvat = input;
			sendC("Reply tin nhắn này chữ nền của bạn", 2, content);
			break;
		case 2:
			content.nen = input;
			sendC("Reply tin nhắn này chữ ký của bạn", 3, content);
			break;
		case 3:
			content.ky = input;
      sendC("Reply tin nhắn này chọn màu của bạn(tên tiếng anh)", 4, content);
      break;
    case 4:
      content.color = input;
      sendC("Reply tin nhắn này fb của bạn", 5, content);
      break;
    case 5:
      content.fb = input;
			const axios = require("axios");
			const fs = require("fs");
			send("Thông tin đã được ghi nhận, vui lòng đợi trong giây lát!");
			global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
			api.unsendMessage(handleReply.messageID);
			let c = content;
			let res = await axios.get(encodeURI(`https://dino-1.araxy.repl.co/taoanhdep?id=${c.nhanvat}&tenchinh=${c.ky}&fb=${c.fb}&tenphu=${c.nen}&color=${c.color}`), { responseType: "arraybuffer" })
				.catch(e => { return send("Lỗi không xác định, liên hệ admin để fix") });
			if (res.status != 200) return send("Đã có lỗi xảy ra, vui lòng thử lại sau!");
			let path = __dirname + `/cache/fbcoverv11__${senderID}.png`;
			fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
			send({
				body: 'Ảnh của bạn đây',
				attachment: fs.createReadStream(path)
			}).then(fs.unlinkSync(path));
			break;
		default:
			break;
	}
}

module.exports.run = ({ api, event, args }) => {
	const { threadID, messageID, senderID } = event;
	return api.sendMessage("Reply tin nhắn này chọn id nhân vật", event.threadID, (err,info) => {
		global.client.handleReply.push({
			step: 1,
			name: this.config.name,
			messageID: info.messageID,
			content: {
				id: senderID,
				nhanvat: "",
				nen: "",
				ky: "",
        color: "",
        fb: ""
        		}
		})
	}, event.messageID);
  }
