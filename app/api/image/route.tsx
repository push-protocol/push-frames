import {NextRequest} from "next/server";
import {ImageResponse} from "next/og";
import {MdVerified} from "react-icons/md";

import {join} from "path";
import fs from "fs";
const fontPath = join(process.cwd(), "public/ProtestStrike-Regular.ttf");
let myFont = fs.readFileSync(fontPath);

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name") ?? "";
  const info = searchParams.get("info") ?? "";
  const icon = searchParams.get("icon") ?? "";
  const subCount = searchParams.get("count") ?? "";
  const verified = searchParams.get("verified") ?? "";
  const section = searchParams.get("section") ?? "1";
  console.log("name", name);
  console.log("info", info);
  console.log("icon", icon);
  console.log("subCount", subCount);
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
        {getSection(section, name, verified, info, subCount)}
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
  subCount?: string
) => JSX.Element;

const getSection: getSection = (
  section: string,
  name,
  verified,
  info,
  subCount
) => {
  switch (section) {
    case "1":
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
