import React from "react";
import Document, {
	DocumentContext,
	Html,
	Head,
	Main,
	NextScript,
} from "next/document";

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head>
					{/* <link
						href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap"
						rel="stylesheet"
					/> */}
					<link
						href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&Caveat:wght@400;500;600;700&family=Nothing+You+Could+Do&family=Shadows+Into+Light&family=Tillana:wght@400;500&display=swap"
						rel="stylesheet"
					/>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
					<link
						href="https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&family=Edu+QLD+Beginner:wght@400;500;600;700&family=Silkscreen:wght@400;700&display=swap"
						rel="stylesheet"
					></link>

					{/* Global Site Tag (gtag.js) - Google Analytics */}
					{/* <script
						async
						src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
						}}
					/> */}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
