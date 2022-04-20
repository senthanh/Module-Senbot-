module.exports.config = {
    name: "family",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "NTKhang fix get by D-Jukie",//lawer
    description: "ảnh nhóm",
    commandCategory: "GAME",
    usages: "family <size> [#mã màu] hoặc family <size>\nNhập size avatar thành viên thích hợp và mã màu cho chữ (mặc định là đen) theo cú pháp:\n$family <size> <mã màu> <title>\nTrong đó:\n•size: Size mỗi avatar thành viên\n•mã màu: mã màu dạng hex\n•title: tiêu đề ảnh, mặc định là tên box\nVí dụ: $family 200 #ffffff Anh em một nhà\nNếu chọn size = 0 thì sẽ tự chỉnh size, nếu không điền title thì title sẽ là tên box",
    cooldowns: 5,
    dependencies: {
      "fs-extra": "", 
      "axios":"", 
      "canvas": "", 
      "jimp": "", 
      "node-superfetch": "",
      "chalk": ""
    }
};


module.exports.run = async ({ event, api, args }) => {

    const circle = async (image) => {

        const jimp = require("jimp")

        image = await jimp.read(image);

        image.circle();

        return await image.getBufferAsync("image/png");

    }

    const jimp = require("jimp")

    const Canvas = require("canvas")

    const fs = require("fs-extra")

    const axios = require("axios")

    const fecth = require("node-fetch");

    const img = new Canvas.Image();



    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };

    const { threadID, messageID } = event;

    var live = [],

        admin = [],

        i = 0;

    if (args[0] == 'help' || args[0] == '0' || args[0] == '-h') return api.sendMessage('User: ' + this.config.name + ' [size avt]' + ' [color code]' + ' [tên nhóm (title)] || Leave all bots blank, they will get information automatically', threadID, messageID)

    /*============DOWNLOAD FONTS=============*/

    if (!fs.existsSync(__dirname + `/cache/TUVBenchmark.ttf`)) {

        let downFonts = (await axios.get(`https://drive.google.com/u/0/uc?id=1NIoSu00tStE8bIpVgFjWt2in9hkiIzYz&export=download`, { responseType: "arraybuffer" })).data;

        fs.writeFileSync(__dirname + `/cache/TUVBenchmark.ttf`, Buffer.from(downFonts, "utf-8"));

    };

    /*===========BACKGROUND & AVATAR FRAMES==========*/

    var bg = ['https://i.imgur.com/P3QrAgh.jpg', 'https://i.imgur.com/RueGAGI.jpg', 'https://i.imgur.com/bwMjOdp.jpg', 'https://i.imgur.com/trR9fNf.jpg']

    var background = await Canvas.loadImage(bg[Math.floor(Math.random() * bg.length)]);

    var bgX = background.width;

    var bgY = background.height;

    var khungAvt = await Canvas.loadImage("https://i.imgur.com/gYxZFzx.png")

    const imgCanvas = Canvas.createCanvas(bgX, bgY);

    const ctx = imgCanvas.getContext('2d');

    ctx.drawImage(background, 0, 0, imgCanvas.width, imgCanvas.height);

    /*===============GET INFO GROUP CHAT==============*/

    var { participantIDs, adminIDs, name, userInfo } = await api.getThreadInfo(threadID)

    // console.log(adminIDs);
    // console.log(userInfo)

    for (let idAD of adminIDs) { admin.push(idAD.id) };

    /*=====================REMOVE ID DIE===================*/

    for (let idUser of userInfo) {

        if (idUser.gender != undefined) { live.push(idUser) }

    }

    // console.log(live)

    /*======================CUSTOM====================*/

    let size, color, title

    var image = bgX * (bgY - 200);

    var sizeParti = Math.floor(image / live.length);

    var sizeAuto = Math.floor(Math.sqrt(sizeParti));

    if (!args[0]) {

        size = sizeAuto;

        color = '#FFFFFF';

        title = encodeURIComponent(name)

    } else {

        size = parseInt(args[0]);

        color = args[1] || '#FFFFFF';

        title = args.slice(2).join(" ") || name;

    }

    /*===========DISTANCE============*/

    var l = parseInt(size / 15),

        x = parseInt(l),

        y = parseInt(200),

        xcrop = parseInt(live.length * size),

        ycrop = parseInt(200 + size);

    size = size - l * 2;

    /*================CREATE PATH AVATAR===============*/

    api.sendMessage(`» Estimated photo: ${participantIDs.length}\n» Size background: ${bgX} x ${bgY}\n» Size Avatar: ${size}\n» Color: ${color}`, threadID, messageID);

    var pathAVT = (__dirname + `/cache/${Date.now() + 10000}.png`)

    /*=================DRAW AVATAR MEMBERS==============*/

    for (let idUser of live) {

        console.log("Vẽ: " + idUser.id);

        try {
            var avtUser = await axios.get(`https://graph.facebook.com/${idUser.id}/picture?width=500&height=500&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`, { responseType: 'arraybuffer'});
          fs.writeFileSync(__dirname + `/cache/${idUser.id}.png`, Buffer.from(avtUser.data, 'utf-8'));

          // console.log(Object.keys(avtUser.data));

            if (x + size > bgX) {

                xcrop = x;

                x += (-x) + l;

                y += size + l;

                ycrop += size + l

            };

            if (ycrop > bgY) { ycrop += (-size); break };

            var avatar = await circle(__dirname + `/cache/${idUser.id}.png`);
          
          fs.unlinkSync(__dirname + `/cache/${idUser.id}.png`);

            var avatarload = await Canvas.loadImage(avatar);

            img.src = avatarload;

            ctx.drawImage(avatarload, x, y, size, size);

            if (admin.includes(idUser.id)) { ctx.drawImage(khungAvt, x, y, size, size) };

            i++

            console.log("\x1b[32mDone: \x1b[37m" + idUser.id);

            x += parseInt(size + l);
        } catch (e) { console.log(e) }
    }

    /*==================DRAW TITLE==================*/

    Canvas.registerFont(__dirname + `/cache/TUVBenchmark.ttf`, { family: "TUVBenchmark" });

    ctx.font = "120px TUVBenchmark";

    ctx.fillStyle = color;

    ctx.textAlign = "center";

    ctx.fillText(decodeURIComponent(title), xcrop / 2, 133);

    /*===================CUT IMAGE===================*/

    console.log(`Vẽ thành công ${i} avt`)

    console.log(`Lọc thành công ${participantIDs.length - i} Facebook users`)

    const cutImage = await jimp.read(imgCanvas.toBuffer());

    cutImage.crop(0, 0, xcrop, ycrop + l - 30).writeAsync(pathAVT);

    await delay(300);

    /*====================SEND IMAGE==================*/

    return api.sendMessage({ body: `» Number member: ${i}\n» Size background: ${bgX} x ${bgY}\n» Filter ${participantIDs.length - i} Facebook users`, attachment: fs.createReadStream(pathAVT) }, threadID, (error, info) => {

        if (error) return api.sendMessage(`Đã xảy ra lỗi ${error}`, threadID, () => fs.unlinkSync(pathAVT), messageID)

        console.log('\x1b[31mGửi ảnh thành công\x1b[37m');

        fs.unlinkSync(pathAVT)

    }, messageID);

}

//export FONTCONFIG_PATH=/etc/fonts
