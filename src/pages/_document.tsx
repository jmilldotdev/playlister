import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var script = document.createElement('script');
                script.src = 'https://js-cdn.music.apple.com/musickit/v1/musickit.js';
                script.async = true;
                document.body.appendChild(script);
              `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
