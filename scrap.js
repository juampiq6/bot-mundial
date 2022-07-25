
const webscraper = require('web-scraper-js');
const TelegramBot = require('node-telegram-bot-api');


const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const arabia = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163862/lang/en'
const mexico = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163878/lang/en'
const polonia = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163893/lang/en'
const octavos = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163904/lang/en'
const cuartos = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163911/lang/en'
const semiarg = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163915/lang/en'
const semiotra = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163916/lang/en'
const final = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163918/lang/en'

// polonia
const stadium974cat1 = '101462819875'
// const stadium974cat1 = 'v2-seatcat_101462819875'
const stadium974cat2 = 'v2-seatcat_101462819876'
const stadium974cat3 = 'v2-seatcat_101462819877'
// mexico, arabia y cuartos
const lusailcat1 = '101468126516'
// const lusailcat1 = 'v2-seatcat_101468126516'
const lusailcat2 = 'v2-seatcat_101468126517'
const lusailcat3 = 'v2-seatcat_101468126518'
// octavos
const binalicat1 = '101461688877'
// const binalicat1 = 'v2-seatcat_101461688877'
const binalicat2 = 'v2-seatcat_101461688878'
const binalicat3 = 'v2-seatcat_101461688879'
// semifinal arg
const lusailsemicat1 = '101468126558'
// const lusailsemicat1 = 'v2-seatcat_101468126558'
const lusailsemicat2 = 'v2-seatcat_101468126559'
const lusailsemicat3 = 'v2-seatcat_101468126560'
// otra semi
const albaitsemicat1 = '101467587113'
// const albaitsemicat1 = 'v2-seatcat_101467587113'
const albaitsemicat2 = 'v2-seatcat_101467587114'
const albaitsemicat3 = 'v2-seatcat_101467587115'
// final
const lusailfinalcat1 = '101468143383'
// const lusailfinalcat1 = 'v2-seatcat_101468143383'
const lusailfinalcat2 = 'v2-seatcat_101468143384'
const lusailfinalcat3 = 'v2-seatcat_101468143385'
let lastErrorDate

const scrapear = async (match, url, cat1) => {
    try {
        let cat1selector = Number(cat1)
        let cat2selector = cat1selector + 1
        let cat3selector = cat1selector + 2


        let result = await webscraper.scrape({
            url: url,
            tags: {
                text: {
                    "1": `.v2-seatcat_${cat1selector} .quantity div, .v2-seatcat_${cat1selector} .quantity select`,
                    "2": `.v2-seatcat_${cat2selector} .quantity div, .v2-seatcat_${cat2selector} .quantity select`,
                    "3": `.v2-seatcat_${cat3selector} .quantity div, .v2-seatcat_${cat3selector} .quantity select`,
                },
            }
        });
        for (const key in result) {
            let value = result[key].toString()
            let unavailable = value == '' || value.includes('unavailable')
            if (!unavailable) {
                console.log(match + ' CAT ' + key + ' Disponible')
                sendTelegram(`${match} CAT ${category} DISPONIBLES \n`)
            }
        }
    } catch (error) {
    }

};

const sendTelegram = async (msg) => {
    const bot = new TelegramBot(TOKEN, { polling: false });
    bot.sendMessage(CHAT_ID, msg)
};

const main = () => {
    const intervalSec = 12
    try {
        sendTelegram(`El bot esta laburando ;) (${intervalSec} seg)`);
        const interval = setInterval(function () {
            console.log(new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }))
            scrapear('ARABIA', arabia, lusailcat1);
            scrapear('MEXICO', mexico, lusailcat1);
            scrapear('POLONIA', polonia, stadium974cat1);
            scrapear('OCTAVOS', octavos, binalicat1);
            scrapear('CUARTOS', cuartos, lusailcat1);
            scrapear('SEMI ARG', semiarg, lusailsemicat1);
            scrapear('SEMI OTRA', semiotra, albaitsemicat1);
            scrapear('FINAL', final, lusailfinalcat1);
        }, intervalSec * 1000);
    } catch (error) {
        sendTelegram('EL BOT FALLO! Probando de nuevo en 5 mins');
        if (lastErrorDate != undefined) {
            var differenceMs = new Date().getTime() - lastErrorDate.getTime();
            var resultInMinutes = Math.round(differenceMs / 60000);
            if (resultInMinutes < 10) {
                sendTelegram('EL BOT DEJO DE LABURAR! Que no se entere PWC');
                process.exit(1);
            }
        }
        lastErrorDate = new Date();
        setImmediate(
            function () {
                main()
            }
        );

    }
}
main()



