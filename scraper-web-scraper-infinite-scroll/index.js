import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
});

const page = await browser.newPage();

await page.goto("http://quotes.toscrape.com/scroll", {
    waitUntil: "domcontentloaded"
})


let moreToLoad = true;
while (moreToLoad) {
    let previousHeight = await page.evaluate("document.body.scrollHeight")
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    moreToLoad = await page.evaluate(`document.body.scrollHeight > ${previousHeight}`)
}

const quotes = await page.evaluate(() => {
    const quoteList = Array.from(document.querySelectorAll(".quote"))
    return quoteList.map((quote) => {
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;
        return {text, author};
    })
})

console.log(quotes)

await browser.close()