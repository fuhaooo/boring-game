if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + ".js", n).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, i) => {
    const c =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[c]) return;
    let r = {};
    const o = (e) => a(e, c),
      t = { module: { uri: c }, exports: r, require: o };
    s[c] = Promise.all(n.map((e) => t[e] || o(e))).then((e) => (i(...e), r));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "b72083f18b7d42999dc36c43756f2dad",
        },
        {
          url: "/_next/static/chunks/224-02565f8f5d2f0bbd.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/253-616aa7e7aeabd3ba.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/2f0b94e8-734829800d3eb38b.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/368-3216af6eafc62f34.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/473f56c0-0933f1e2ac7ad0b5.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/4bd1b696-48a906261550a4c5.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/514-a0c3a7886bf442bd.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/658-e54429557207cf0c.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/684-3cf479aafee24c45.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/70646a03-d8bbffbaf77fafd0.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/850-4cf9e0d82a216941.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/886-dc75b0f6824c5dc8.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/94-e8b809c8e2fbb6ee.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/969-e4d64789d27fa0d3.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/972.e3d456ce658179cb.js",
          revision: "e3d456ce658179cb",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-04d3b5ab1d5bc6de.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/app/api/price/route-6c0ab67fce666a7b.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/app/configure/page-c2e24bae664f75cb.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/app/debug/page-1cae8726b857334c.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/app/game/page-d435c86dae3a0505.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/app/layout-5905237ab33f7882.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/app/page-78153f56d01a511a.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/e6909d18-4ba8469a30d603db.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/framework-be704551803917a8.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/main-app-554c894b6db90a32.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/main-c92e350826251d1e.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/pages/_app-da15c11dea942c36.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/pages/_error-cc3f077a18ea1793.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-ee2825d1203a8633.js",
          revision: "x7O39_bUo0Qa_hQAYdUZk",
        },
        {
          url: "/_next/static/css/421a832b990b738f.css",
          revision: "421a832b990b738f",
        },
        {
          url: "/_next/static/x7O39_bUo0Qa_hQAYdUZk/_buildManifest.js",
          revision: "88a4ce6730b8e497b54a73c8bc4e20b2",
        },
        {
          url: "/_next/static/x7O39_bUo0Qa_hQAYdUZk/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/blast-icon-color.svg",
          revision: "f455c22475a343be9fcd764de7e7147e",
        },
        {
          url: "/bubble/bubble-wrap-single-pop.mp3",
          revision: "3384b914fb28d90563387c0dd5f09b86",
        },
        {
          url: "/bubble/bubble-wrap-single-unpop.mp3",
          revision: "e624c8e92035705b65751a52743a64ad",
        },
        {
          url: "/bubble/button-tap.mp3",
          revision: "c01f056d3cd8ec43cbf13d864d105e07",
        },
        {
          url: "/bubble/level-up.mp3",
          revision: "3cdb1b472475ea9081a81c950b15fa2a",
        },
        {
          url: "/bubble/popped.svg",
          revision: "f401e7f478d863db8188fdb2fbd2b3c5",
        },
        {
          url: "/bubble/prepop.svg",
          revision: "7e2e510ece541d3a5dcf8dba73848983",
        },
        {
          url: "/debug-icon.svg",
          revision: "25aadc709736507034d14ca7aabcd29d",
        },
        {
          url: "/debug-image.png",
          revision: "34c4ca2676dd59ff24d6338faa1af371",
        },
        {
          url: "/dragon-ball/1.png",
          revision: "45b947b83263b9c2ef6dc0fc846b64ad",
        },
        {
          url: "/dragon-ball/2.png",
          revision: "d8039377556e93e2647b3520d62b07a0",
        },
        {
          url: "/dragon-ball/3.png",
          revision: "04651ece13a3a81748f73fe75f8d891e",
        },
        {
          url: "/dragon-ball/4.png",
          revision: "0ddeb5687a513e882b256ed620b73e65",
        },
        {
          url: "/dragon-ball/5.png",
          revision: "c704b70e29c143a2ecef0e5df2fc438d",
        },
        {
          url: "/dragon-ball/6.png",
          revision: "bbb2130b84f6fada73ecf0cb75be2937",
        },
        {
          url: "/dragon-ball/7.png",
          revision: "ca5ef38239a5488a46dc1e6b9ec1ebe8",
        },
        {
          url: "/explorer-icon.svg",
          revision: "84507da0e8989bb5b7616a3f66d31f48",
        },
        {
          url: "/gif/toothless.gif",
          revision: "a42b555acdbf769c9131bfe0d57f5935",
        },
        {
          url: "/gradient-s.svg",
          revision: "c003f595a6d30b1b476115f64476e2cf",
        },
        {
          url: "/home/back1.jpg",
          revision: "cb8529fe0bfe2b63f3b4bd796722ee14",
        },
        {
          url: "/home/back2.jpg",
          revision: "cd4c8fc5a815c59c6d29fc05acad685d",
        },
        {
          url: "/home/back3.jpg",
          revision: "72c060f41d1cef70056d3d52ebdaed69",
        },
        {
          url: "/home/back4.jpg",
          revision: "0897d4bf4744362ef32192a6ffbb7ec0",
        },
        {
          url: "/home/back5.jpg",
          revision: "c017ff46ecbe457eccff3ef70ef629c4",
        },
        {
          url: "/home/back6.jpg",
          revision: "0ab7541b6ea353489929bd258abd6cc4",
        },
        {
          url: "/home/back7.jpg",
          revision: "be67711e79c7c9f2c8db3221429607cd",
        },
        {
          url: "/home/back8.jpg",
          revision: "38558a9405905dfa1ef42ddc82c1e0e8",
        },
        {
          url: "/home/people.png",
          revision: "f81bed37e240cc26cf864d70e81bfbb6",
        },
        {
          url: "/home/title.png",
          revision: "a085c9ab4e0758a9a2e72b4629defaca",
        },
        { url: "/lofi-girl.svg", revision: "1b221f84e27c3a38b5a0caa4c6fd7d69" },
        { url: "/logo.ico", revision: "0359e607e29a3d3b08095d84a9d25c39" },
        { url: "/logo.svg", revision: "962a8546ade641ef7ad4e1b669f0548c" },
        { url: "/manifest.json", revision: "781788f3e2bc4b2b176b5d8c425d7475" },
        {
          url: "/nft/dragon-nft.png",
          revision: "1e958a15485e3f00dedaa35b97251c84",
        },
        {
          url: "/rpc-version.png",
          revision: "cf97fd668cfa1221bec0210824978027",
        },
        {
          url: "/scaffold-config.png",
          revision: "1ebfc244c31732dc4273fe292bd07596",
        },
        {
          url: "/sn-symbol-gradient.png",
          revision: "908b60a4f6b92155b8ea38a009fa7081",
        },
        {
          url: "/sounds/click.mp3",
          revision: "7f90c47fcc5f15e0c0e94b3bfb6467f7",
        },
        {
          url: "/starkcompass-icon.svg",
          revision: "eccc2ece017ee9e73e512996b74e49ac",
        },
        {
          url: "/voyager-icon.svg",
          revision: "06663dd5ba2c49423225a8e3893b45fe",
        },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: n,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    );
});
