import {NextRequest} from "next/server";
import {ImageResponse} from "next/og";
import {MdVerified} from "react-icons/md";

import {join} from "path";
import fs from "fs";
const fontPath = join(process.cwd(), "public/ProtestStrike-Regular.ttf");
let myFont = fs.readFileSync(fontPath);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name") ?? "";
  const info = searchParams.get("info") ?? "";
  const icon = searchParams.get("icon") ?? "";
  const subCount = searchParams.get("count") ?? "";
  const verified = searchParams.get("verified") ?? "";
  const section = searchParams.get("section") ?? "1";
  const message = searchParams.get("message") ?? "";
  const chain = searchParams.get("chain") ?? "";
  const address = searchParams.get("address") ?? "";

  const image_url = `${process.env.NEXT_PUBLIC_HOST}/bg.png`;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          backgroundImage: `url(${image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {getSection(
          section,
          name,
          verified,
          info,
          subCount,
          message,
          chain,
          address
        )}
      </div>
    ),
    {
      width: 1528, // Match these dimensions to your image's dimensions
      height: 800,
      fonts: [
        {
          name: "my font",
          data: myFont,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}

type getSection = (
  section: string,
  name?: string,
  verified?: string,
  info?: string,
  subCount?: string,
  message?: string,
  chain?: string,
  address?: string
) => JSX.Element;

const getSection: getSection = (
  section: string,
  name,
  verified,
  info,
  subCount,
  message,
  chain,
  address
) => {
  switch (section) {
    case "1":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "1500px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {name && (
            <h1
              style={{
                fontSize: "160px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              {name} {verified === "1" && <MdVerified />}
            </h1>
          )}
          {info && (
            <p style={{fontSize: "50px", textAlign: "center"}}>{info}</p>
          )}
          <p style={{fontSize: "50px", color: "white"}}>
            Subscribers: {subCount ?? 0}
          </p>
        </div>
      );
    case "2":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "1000px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1000px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: "90px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              Subscribed Successfully
            </h1>
            <MdVerified color="green" size={"100px"} />
          </div>
        </div>
      );
    case "3":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "1000px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1000px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: "90px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              Unsubscribed Successfully
            </h1>
            <MdVerified color="green" size={"100px"} />
          </div>
        </div>
      );

    case "error":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "800px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "red",
            }}
          >
            Error
          </h1>
          {message && (
            <p style={{fontSize: "50px", textAlign: "center"}}>{message}</p>
          )}
        </div>
      );

    case "pay":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "90px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            Payments Made easy!
          </h1>
          <div
            style={{
              padding: "20px 40px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              border: "2px dashed #00ffff",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                flexDirection: `${
                  address?.startsWith("0x") ? "column" : "row"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                Send {chain}
                <span
                  style={{
                    padding: "0 10px",
                    backgroundImage:
                      "linear-gradient(to right, #00d9ff, #c9fffb)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {/* {chain === "matic" || chain === "polygon" ? "$MATIC" : "$ETH"} */}
                  {getToken(chain)}
                </span>
                to
              </div>
              <span
                style={{
                  paddingLeft: "10px",
                  backgroundImage:
                    "linear-gradient(to right, #00d9ff, #c9fffb)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {address}
              </span>
            </div>
          </div>
        </div>
      );
    case "payment_success":
      return (
        <div
          style={{
            padding: "20px 40px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            border: "2px dashed #00ffff",
          }}
        >
          <h1
            style={{
              fontSize: "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: "linear-gradient(to right, #00d9ff, #c9fffb)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Payment Successful
          </h1>
        </div>
      );
    default:
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "800px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {name && (
            <h1
              style={{
                fontSize: "120px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              {name} {verified === "1" && <MdVerified />}
            </h1>
          )}
          {info && (
            <p style={{fontSize: "30px", textAlign: "center"}}>{info}</p>
          )}
          <p style={{fontSize: "30px", color: "white"}}>
            Subscribers: {subCount ?? 0}
          </p>
        </div>
      );
  }
};

function getToken(chain: string) {
  switch (chain) {
    case "matic":
      return "$MATIC";
    case "bsc":
      return "$BNB";
    case "polygon":
      return "$MATIC";
    default:
      return "$ETH";
  }
}
