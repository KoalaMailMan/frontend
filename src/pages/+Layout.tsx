import React from "react";
import { Head } from "vike-react/Head";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
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
      </Head>
      <main>{children}</main>
    </>
  );
}
