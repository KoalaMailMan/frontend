export default function Head() {
  return (
    <>
      <title>만다라트 목표 작성 & 리마인드 | 코알라 우체부</title>
      <link rel="canonical" href="https://ringdong.kr/" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/svg+xml" href="/koala.svg" />
      <meta
        name="naver-site-verification"
        content="3920947bcefe8028bf2eee65811cf9f31ca08fd9"
      />

      {/* <!-- 기본 SEO --> */}
      <title>만다라트 목표 작성 & 리마인드 | 코알라 우체부</title>
      <meta
        name="description"
        content="코알라 우체부는 만다라트 기반으로 목표를 설정하고, 리마인드하는 서비스입니다."
      />
      <meta
        name="keywords"
        content="만다라트, 만다라트계획표, 목표관리, 목표설정, 계획, 자기계발"
      />

      {/* <!-- Open Graph SEO --> */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="만다라트" />
      <meta
        property="og:title"
        content="만다라트 목표 작성 & 리마인드 | 코알라 우체부"
      />
      <meta
        property="og:description"
        content="코알라 우체부는 만다라트 기반으로 목표를 설정하고, 리마인드하는 서비스입니다."
      />
      <meta property="og:url" content="https://ringdong.kr" />

      {/* <!-- naver SEO --> */}
      <meta
        name="naver-site-verification"
        content="3920947bcefe8028bf2eee65811cf9f31ca08fd9"
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `   {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "만다라트",
          "applicationCategory": "ProductivityApplication",
          "description": "코알라 우체부는 만다라트 기반으로 목표를 설정하고, 리마인드하는 서비스입니다.",
          "url": "https://ringdong.kr",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "KRW"
          },
          "operatingSystem": "Any",
          "browserRequirements": "Requires JavaScript",
          "featureList": [
            "9x9 만다라트 차트",
            "목표 설정 및 관리",
            "목표 리마인드"
          ],
          "inLanguage": "ko"
        }`,
        }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
      (function () {
        try {
          const saved = localStorage.getItem("koalart_theme");
          const validThemes = ["spring", "summer", "autumn", "winter"];
          if (saved && validThemes.includes(saved)) {
            document.documentElement.setAttribute("data-theme", saved);
          } else {
            const month = new Date().getMonth();
            const season =
              month >= 2 && month <= 4
                ? "spring"
                : month >= 5 && month <= 7
                ? "summer"
                : month >= 8 && month <= 10
                ? "autumn"
                : "winter";
            document.documentElement.setAttribute("data-theme", season);
            
          }
        } catch (e) {}
      })();
      `,
        }}
      />
    </>
  );
}
