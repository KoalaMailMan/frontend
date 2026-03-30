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
        content="코알라 우체부는 만다라트 기반으로 목표를 설정하고, 리마인드하는 서비스입니다. 만다라트는 목표를 세부적으로 나눠 계획할 수 있는 도구로, 코알라 우체부에서 사용해보세요. 코알라 우체부로 목표를 작성하고 AI 추천을 받아 나만의 만다라트를 완성할 수 있습니다. 작성 완료 후, 코알라 우체부가 목표를 잊지 않게 리마인드 메일을 보내드립니다. 지금 바로 시작해서 나만의 만다라트를 완성하고 목표를 달성해보세요."
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
        content="코알라 우체부는 만다라트 기반으로 목표를 설정하고, 리마인드하는 서비스입니다. 만다라트는 목표를 세부적으로 나눠 계획할 수 있는 도구로, 코알라 우체부에서 사용해보세요. 코알라 우체부로 목표를 작성하고 AI 추천을 받아 나만의 만다라트를 완성할 수 있습니다. 작성 완료 후, 코알라 우체부가 목표를 잊지 않게 리마인드 메일을 보내드립니다. 지금 바로 시작해서 나만의 만다라트를 완성하고 목표를 달성해보세요."
      />
      <meta property="og:url" content="https://ringdong.kr" />

      {/* <!-- naver SEO --> */}
      <meta
        name="naver-site-verification"
        content="3920947bcefe8028bf2eee65811cf9f31ca08fd9"
      />

      {/* <!-- GA4 스크립트 --> */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-YMJF98S5GN"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YMJF98S5GN', {
      'send_page_view': false // SPA는 수동 페이지뷰 전송
    });

    // SPA 페이지뷰 트래킹 함수
    function trackPageView(path, title) {
      gtag('event', 'page_view', {
        page_path: path,
        page_title: title
      });
    }`,
        }}
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
          "description": "코알라 우체부는 만다라트 기반으로 목표를 설정하고, 리마인드하는 서비스입니다. 만다라트는 목표를 세부적으로 나눠 계획할 수 있는 도구로, 코알라 우체부에서 사용해보세요. 코알라 우체부로 목표를 작성하고 AI 추천을 받아 나만의 만다라트를 완성할 수 있습니다. 작성 완료 후, 코알라 우체부가 목표를 잊지 않게 리마인드 메일을 보내드립니다. 지금 바로 시작해서 나만의 만다라트를 완성하고 목표를 달성해보세요.",
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
