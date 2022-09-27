
const webscraper = require('web-scraper-js');
const TelegramBot = require('node-telegram-bot-api');


const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

var bot

const arabia = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163862/lang/en'
const mexico = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163878/lang/en'
const polonia = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163893/lang/en'
const octavos = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163904/lang/en'
const cuartos = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163911/lang/en'
const semiarg = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163915/lang/en'
const semiotra = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163916/lang/en'
const final = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163918/lang/en'
const brasilserbia = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163870/lang/en'
const cuartos60 = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163914/lang/en'
const cuartos59 = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163913/lang/en'


// polonia
const stadium974cat1 = '101462819875'
// mexico, arabia y cuartos
const lusailcat1 = '101468126516'
// octavos
const binalicat1 = '101461688877'
// semifinal arg
const lusailsemicat1 = '101468126558'
// otra semi
const albaitsemicat1 = '101467587113'
// final
const lusailfinalcat1 = '101468143383'
// otros cuartos
const altuamaStadium = '101467463857'
let lastErrorDate

const scrapear = async (match, url, cat1) => {
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
    var fullText = ''
    for (const key in result) {
        let category = key
        let value = result[key].toString()
        let unavailable = value == '' || value.includes('unavailable')
        if (!unavailable) {
            var txt = `${match} CAT${category}\n${url}\n`
            fullText = fullText + txt;
        }
        if (txt != '' && txt != undefined) {
            console.log(txt)
        }
    }
    return fullText;
};

const sendTelegram = async (msg) => {
    try {
        await bot.sendMessage(CHAT_ID, msg)
    } catch (e) {
        console.log(e)
        console.log('ERROR mandando mensaje en Telegram!');
        process.exit(1);
    }
};

const main = () => {
    const intervalSec = 12
    bot = new TelegramBot(TOKEN, { polling: false });
    try {
        sendTelegram(`El bot esta laburando ;) (${intervalSec} seg)`);
        const interval = setInterval(function () {
            console.log(new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }))
            var promise = Promise.allSettled([
                scrapear('ARABIA', arabia, lusailcat1),
                scrapear('MEXICO', mexico, lusailcat1),
                scrapear('POLONIA', polonia, stadium974cat1),
                scrapear('OCTAVOS', octavos, binalicat1),
                scrapear('CUARTOS', cuartos, lusailcat1),
                scrapear('SEMI ARG', semiarg, lusailsemicat1),
                scrapear('SEMI OTRA', semiotra, albaitsemicat1),
                scrapear('FINAL', final, lusailfinalcat1),
                scrapear('BRASIL SERBIA', brasilserbia, lusailcat1),
                scrapear('CUARTOS 60', cuartos60, altuamaStadium),
                scrapear('CUARTOS 59', cuartos59, altuamaStadium),
            ],
            )
            promise.then((promisesResults) => {
                var finalText = ''
                promisesResults.forEach((e) => {
                    if (e.value != '' && e.value != undefined) {
                        finalText = finalText + e.value
                    }
                });
                if (finalText != '') {
                    sendTelegram(finalText)
                }
            })
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



