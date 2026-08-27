import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title =
      searchParams.get("title") || "Mohd. Rehman Baig (md-rehman)";
    const subtitle =
      searchParams.get("subtitle") ||
      "Senior React & React Native Engineer | Core Contributor to NativeBase";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(124, 77, 255, 0.25) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(0, 229, 255, 0.2) 0%, transparent 70%)",
            padding: "80px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c4dff, #00e5ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              MR
            </div>
            <span
              style={{
                fontSize: "26px",
                letterSpacing: "0.12em",
                color: "#00e5ff",
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              md-rehman.dev
            </span>
          </div>

          <h1
            style={{
              fontSize: "58px",
              fontWeight: "800",
              lineHeight: "1.15",
              margin: "0 0 20px 0",
              background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: "26px",
              color: "#94a3b8",
              margin: 0,
              maxWidth: "960px",
              lineHeight: "1.4",
            }}
          >
            {subtitle}
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "44px",
            }}
          >
            {["React Native", "Next.js", "Design Systems", "TypeScript"].map(
              (badge) => (
                <div
                  key={badge}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "24px",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    fontSize: "18px",
                    color: "#e2e8f0",
                    fontWeight: "500",
                  }}
                >
                  {badge}
                </div>
              )
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
