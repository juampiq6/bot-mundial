
const webscraper = require('web-scraper-js');

const lusailcat1 = '101468126516'
const brasilserbia = 'https://fcfs-intl.fwc22.tickets.fifa.com/secure/selection/event/seat/performance/101437163870/lang/en'


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
        console.log(key)
        console.log(result[key].toString())
        let value = result[key].toString()
        let unavailable = value == '' || value.includes('unavailable')
        console.log(match, unavailable)
        if (!unavailable) {
            var txt = `${match} CAT DISPONIBLES \n`
            console.log(txt)
            fullText = fullText + txt;
        }
    }
}

scrapear('BRASIL SERBIA', brasilserbia, lusailcat1);