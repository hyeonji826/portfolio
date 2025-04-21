const serviceKey =
  "fQlfPKnYI5jKgbG0KRQHAE1byN6vF46OBF/B7t4svBhp/3n+vsVBaK322v5yH+AJbtMYn5d80ICQgzXeIlxbcw==";

function getTmFc() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = now.getHours();
  const base = h < 18 ? "0600" : "1800";
  return `${y}${m}${d}${base}`;
}

async function getWeather() {
  const region = document.getElementById("region").value;
  const tmFc = getTmFc();
  const encodedKey = encodeURIComponent(serviceKey);

  const tempUrl = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${encodedKey}&numOfRows=10&pageNo=1&dataType=JSON&regId=${region}&tmFc=${tmFc}`;
  const rainUrl = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${encodedKey}&numOfRows=10&pageNo=1&dataType=JSON&regId=${region}&tmFc=${tmFc}`;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "<p>날씨 데이터를 불러오는 중...</p>";

  try {
    const [tempRes, rainRes] = await Promise.all([
      fetch(tempUrl).then((res) => res.json()),
      fetch(rainUrl).then((res) => res.json()),
    ]);

    const temp = tempRes.response.body.items.item[0];
    const rain = rainRes.response.body.items.item[0];

    const html = `
      <div class="card">
        <h2>예보 날짜 기준: ${tmFc.slice(0, 4)}-${tmFc.slice(
      4,
      6
    )}-${tmFc.slice(6, 8)}</h2>
        
        <p><strong>Day5 평균기온:</strong> ${avg(
          temp.taMin5,
          temp.taMax5
        )}°C</p>
        <p><strong>Day6 평균기온:</strong> ${avg(
          temp.taMin6,
          temp.taMax6
        )}°C</p>
        <hr>
        <p><strong>Day5 강수확률:</strong> ${avg(
          rain.rnSt5Am,
          rain.rnSt5Pm
        )}%</p>
        <p><strong>Day6 강수확률:</strong> ${avg(
          rain.rnSt6Am,
          rain.rnSt6Pm
        )}%</p>
      </div>
    `;

    resultDiv.innerHTML = html;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = `<p style="color:red">데이터 불러오기 오류: ${err.message}</p>`;
  }
}

function avg(min, max) {
  return ((parseFloat(min) + parseFloat(max)) / 2).toFixed(1);
}
