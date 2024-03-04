"use strict";
require("dotenv").config({ path: "../.env" });

const { exec } = require("child_process");
 exec("render-build.sh", (error, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  if (error !== null) {
    console.log(`exec error: ${error}`);
  }
 });

const apiKey = process.env.API_KEY;
const TCNo = process.env.TC_NO;
const password = process.env.SPOR_ISTANBUL_PASSWORD;
console.log(
  "apiKey: ",
  apiKey,
  "\n",
  "TC_NO: ",
  TCNo,
  "\n",
  "password: ",
  password
);
const sporNo = "1";
const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
console.log("Program başladı!");
const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
console.log("Program başladı!");
console.log(new Date().toLocaleTimeString());
(async () => {
  puppeteer.use(
    RecaptchaPlugin({
      provider: {
        id: "2captcha",
        token: apiKey, // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
      },
      visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
    })
  );
  //online.spor.istanbul sitesine giren kod
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://online.spor.istanbul/uyegiris");

  // //buraya tıklasın
  /*
  <input name="txtTCPasaport" type="text" id="txtTCPasaport" class="form-control form-control-solid placeholder-no-fix" placeholder="TC/Pasaport No">
  */
  // Randevu.js dosyasının içeriği
  console.log("Randevu zamanı!");
  //print timeStamp now hh/mm/ss
  console.log(new Date().toLocaleTimeString());
  await page.click("input#txtTCPasaport");
  await page.keyboard.type(TCNo.toString());
  /*<input name="txtSifre" type="password" id="txtSifre" class="form-control form-control-solid placeholder-no-fix" placeholder="Şifre">*/
  await page.click("input#txtSifre");
  await page.keyboard.type(password.toString());
  /*<input type="submit" name="btnGirisYap" value="Giriş Yap" onclick="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;btnGirisYap&quot;, &quot;&quot;, true, &quot;login&quot;, &quot;&quot;, false, false))" id="btnGirisYap" class="btn btn-block">*/
  await page.click("input#btnGirisYap");
  console.log(">>>>>>>>Giriş yapıldı<<<<<<<<<<<<<");
  const index = 1;
  var seansIndex = 0;
  //index eğer 0 2 4 7 9 11 ise seans index 1 değilse 0 olacak
  if (
    index === 0 ||
    index === 2 ||
    index === 4 ||
    index === 7 ||
    index === 9 ||
    index === 11
  ) {
    seansIndex = 1;
  } else {
    seansIndex = 0;
  }

  // uyespor sayfasına gir
  await page.goto("https://online.spor.istanbul/uyespor");
  // 3 saniye bekle ve sonra ekran görüntüsü al
  await new Promise((resolve) => setTimeout(resolve, 2000));

  //butonun yuklenmesini bekle pageContent_rptListe_lbtnSeansSecim_0
  /*
   */
  await page.waitForSelector(`a#pageContent_rptListe_lbtnSeansSecim_${sporNo}`);
  //butona tıkla
  await page.click(`a#pageContent_rptListe_lbtnSeansSecim_${sporNo}`);
  // 3 saniye bekle ve sonra ekran görüntüsü al
  await new Promise((resolve) => setTimeout(resolve, 2000));

  //checkboxun yuklenmesini bekle
  /*
  <input id="pageContent_rptList_ChildRepeater_8_cboxSeans_0" type="checkbox" name="ctl00$pageContent$rptList$ctl08$ChildRepeater$ctl00$cboxSeans" onclick="javascript:setTimeout('__doPostBack(\'ctl00$pageContent$rptList$ctl08$ChildRepeater$ctl00$cboxSeans\',\'\')', 0)">
  */
  await page.waitForSelector(
    `#pageContent_rptList_ChildRepeater_${index}_cboxSeans_${seansIndex}`
  );
  //checkboxa tıkla
  await page.click(
    `#pageContent_rptList_ChildRepeater_${index}_cboxSeans_${seansIndex}`
  );
  // 3 saniye bekle ve sonra ekran görüntüsü al
  await new Promise((resolve) => setTimeout(resolve, 2000));

  //checkboxun yuklenmesini bekle
  /*
  pageContent_cboxOnay
  */
  await page.waitForSelector("#pageContent_cboxOnay");
  //checkboxa tıkla
  await page.click("#pageContent_cboxOnay");
  // 3 saniye bekle ve sonra ekran görüntüsü al
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("recaptcha çözülüyor");
  //recaptcha çöz
  // That's it, a single line of code to solve reCAPTCHAs 🎉
  await page.solveRecaptchas();
  console.log("recaptcha çözüldü");
  // 3 saniye bekle ve sonra ekran görüntüsü al
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 3 saniye bekle
  await new Promise((resolve) => setTimeout(resolve, 2000));
  //kaydet butonunun yuklenmesini bekle

  /*
  <a onclick="return DisableButon();" id="lbtnKaydet" class="btn btn-block mb15 btn-success" href="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$pageContent$lbtnKaydet&quot;, &quot;&quot;, true, &quot;valKaydet&quot;, &quot;&quot;, false, true))"> <i class="fa fa-cart-arrow-down"></i> Kaydet</a>
  */
  await page.waitForSelector("a#lbtnKaydet");
  //kaydet butonuna tıkla
  await page.click("a#lbtnKaydet");
  // 3 saniye bekle ve sonra ekran görüntüsü al
  await new Promise((resolve) => setTimeout(resolve, 10000));
  //close the browser
  await browser.close();
})();
// Başlangıç ve bitiş tarihlerini belirleyin
function gunIndeksiniGetir() {
  var today = new Date().getDay();
  // Haftanın günlerine göre indeksleri döndürür
  // Pazar 0, Pazartesi 1, ... Cumartesi 6
  //cumartesi ve cuma günleri 14 slot digerleri 7 li.
  // yani cts cuma günü indeksine +7 ekleyerek seans indexini bulabiliriz

  if (today == 0 || today == 5) {
    return today + 7;
  } else return today;
}
