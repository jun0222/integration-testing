(() => {
  const byId = id => document.getElementById(id);

  // ランダム生成系
  const phone = () => (Math.random() < 0.5 ? "090" : "080") + "-" +
    String(Math.floor(1000 + Math.random() * 9000)) + "-" +
    String(Math.floor(1000 + Math.random() * 9000));

  const postal = () => String(Math.floor(100 + Math.random() * 900)) + "-" +
    String(Math.floor(1000 + Math.random() * 9000));

  const expiry = () => {
    const now = new Date();
    const m = String(((now.getMonth() + 1) % 12) + 1).padStart(2, "0");
    const y = String(now.getFullYear() + 2).slice(-2);
    return `${m}/${y}`;
  };

  const luhn = prefix => {
    let num = prefix;
    while (num.length < 15) num += Math.floor(Math.random() * 10);
    const digits = num.split("").map(d => +d);
    let sum = 0;
    for (let i = digits.length - 1, alt = true; i >= 0; i--, alt = !alt) {
      let n = digits[i];
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
    }
    const check = (10 - (sum % 10)) % 10;
    return num + check;
  };

  const formatCard = s => s.replace(/\D/g, "").match(/.{1,4}/g).join(" ");

  // 入力値設定
  const fill = () => {
    const d = {
      name: "山田 太郎",
      email: `taro${Math.floor(Math.random() * 1000)}@example.com`,
      phone: phone(),
      postal: postal(),
      prefecture: "東京都",
      city: "港区芝公園",
      address: "4-2-8 東京タワー内",
      card: formatCard(luhn("4")),
      expiry: expiry(),
      cvv: String(Math.floor(100 + Math.random() * 900))
    };
    const s = (id, val) => {
      const el = byId(id);
      if (el) el.value = val;
    };
    s("name", d.name);
    s("email", d.email);
    s("phone", d.phone);
    s("postal", d.postal);
    s("prefecture", d.prefecture);
    s("city", d.city);
    s("address", d.address);
    s("card-number", d.card);
    s("expiry", d.expiry);
    s("cvv", d.cvv);
    const terms = byId("terms");
    if (terms) terms.checked = true;
    console.log("✅ フォームを自動入力しました。");
  };

  fill();
})();
