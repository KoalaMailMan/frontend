export function Head() {
  return (
    <>
      {/* 기본 메타 태그 */}
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta
        name="keywords"
        content="만다라트, 만다라트계획표, 목표관리, 목표설정, 계획, 자기계발"
      />
      <meta
        name="description"
        content="코알라 우체부는 만다라트 기반으로 목표를 설정하고, 리마인드하는 서비스입니다."
      />
      <link rel="canonical" href="https://ringdong.kr/" />
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/svg+xml" href="/koala.svg" />
      <title>만다라트 목표 작성 & 리마인드 | 코알라 우체부</title>

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      {/* preload */}
      <link
        rel="preload"
        href="/fonts/Inter-VariableFont_opsz,wght.ttf"
        as="font"
        type="font/ttf"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="images/koala_mailman_text_logo_940.webp"
        as="image"
        fetchPriority="high"
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
      <meta
        property="og:image"
        content="/images/koala_mailman_text_logo_576.webp"
      />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="만다라트 목표 작성 & 리마인드 | 코알라 우체부"
      />
      <meta
        name="twitter:description"
        content="코알라 우체부는 만다라트 기반으로 목표를 설정하고, 리마인드하는 서비스입니다."
      />
      <meta
        name="twitter:image"
        content="/images/koala_mailman_text_logo_576.webp"
      />
      {/* <!-- naver SEO --> */}
      <meta
        name="naver-site-verification"
        content="3920947bcefe8028bf2eee65811cf9f31ca08fd9"
      />

      {/* External Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "만다라트",
            applicationCategory: "ProductivityApplication",
            description:
              "코알라 우체부는 만다라트 기반으로 목표를 설정하고, 리마인드하는 서비스입니다.",
            url: "https://ringdong.kr",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "KRW",
            },
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript",
            featureList: [
              "9x9 만다라트 차트",
              "목표 설정 및 관리",
              "목표 리마인드",
            ],
            inLanguage: "ko",
          }),
        }}
      />
    </>
  );
}
