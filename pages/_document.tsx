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
