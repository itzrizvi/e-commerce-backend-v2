const puppeteer = require('puppeteer');
const ejs = require('ejs');
const { join } = require("path");


const generatePDF = async (po_id, data, htmltemplate) => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    // Compile the EJS template
    const template = htmltemplate;
    const compiledTemplate = ejs.compile(template);

    // Render the template with the data
    const html = compiledTemplate(data);

    // Set the content of the page to the rendered template
    await page.setContent(html);
    console.log(page)
    // Generate a PDF of the page
    let pdfName = `${po_id}-${new Date().getTime()}`;
    await page.pdf({
        format: 'A4',
        path: join(__dirname, `../../tmp/${pdfName}`)
    })
    await browser.close();
}


// // Example usage:
// const data = { name: 'Rijvi', email: 'rijvi@example.com', address: { city: "dhaka" } };
// const pdf = renderTemplate(data);
// console.log(pdf);

module.exports = {
    generatePDF
}
