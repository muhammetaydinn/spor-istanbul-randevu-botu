const schedule = require("node-schedule");
const { exec } = require("child_process");

console.log("Program başladı!");
console.log(new Date().toLocaleTimeString());
//timezone ile ugrasmaya usendim -3 saat fark var
const zamanlar = [
  "0 05 17 * * 0",
  "0 35 3 * * 1",
  "0 05 17 * * 2",
  "0 05 12 * * 3",
  "0 05 12 * * 4",
  "0 05 17 * * 5",
  "0 35 3 * * 6",
];


zamanlar.forEach((zaman) => {
  const [saniye, dakika, saat, a, b, gun] = zaman.split(" ");
  schedule.scheduleJob(`${saniye} ${dakika} ${saat} * * *`, () => {
    console.log(
      `Randevu.js dosyası ${hangiGun} gunu saat ${saat}:${dakika}:${saniye}'de çalıştırılıyor...`
    );
    exec("node randevu.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`Hata oluştu: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Hata: ${stderr}`);
        return;
      }
      console.log(`Çıktı: ${stdout}`);
    });
  });
});

function hangiGun(gun) {
  switch (gun) {
    case 0:
      return "Pazar";
    case 1:
      return "Pazartesi";
    case 2:
      return "Salı";
    case 3:
      return "Çarşamba";
    case 4:
      return "Perşembe";
    case 5:
      return "Cuma";
    case 6:
      return "Cumartesi";
  }
}
