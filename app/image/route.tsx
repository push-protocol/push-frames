import {NextRequest} from "next/server";
import {ImageResponse} from "next/og";
import {MdVerified} from "react-icons/md";

import {join} from "path";
import fs from "fs";
import {verifyState} from "../channel/create/route";
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
  const step = searchParams.get("step") ?? "0";
  const image_url = `${process.env.NEXT_PUBLIC_HOST}/bg.png`;
  const error = searchParams.get("error") ?? "";
  const state = searchParams.get("state") ?? "";
  console.log("state", state);
  const deserializeState =
    state.length > 2 ? await verifyState(state) : undefined;
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
          address,
          step,
          error,
          deserializeState
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
  address?: string,
  step?: string,
  error?: string,
  state?: any
) => JSX.Element;

const getSection: getSection = (
  section,
  name,
  verified,
  info,
  subCount,
  message,
  chain,
  address,
  step,
  error,
  state
) => {
  console.log("state", state);
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
                  {getToken(chain!)}
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

    case "create_channel":
      if (step === "0") {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1200px",
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
                color: "white",
                textAlign: "center",
              }}
            >
              Create a Push Channel
            </h1>
          </div>
        );
      } else if (step === "1") {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1200px",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "120px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                textAlign: "center",
              }}
            >
              Input the name of the channel
            </h1>
          </div>
        );
      } else if (step === "2") {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1200px",
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
                color: "white",
                textAlign: "center",
              }}
            >
              Description of the channel
            </h1>
          </div>
        );
      } else if (step === "3") {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1200px",
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
                color: "white",
                textAlign: "center",
              }}
            >
              Website URL of the channel
            </h1>
          </div>
        );
      } else if (step === "4") {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1200px",
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
                color: "white",
              }}
            >
              Channel Icon URL
            </h1>
          </div>
        );
      } else if (step === "5") {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1200px",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "120px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                textAlign: "center",
              }}
            >
              $Push Staking
            </h1>
            <p
              style={{
                fontSize: "60px",
                textAlign: "center",
                color: "white",
              }}
            >
              You will have to stake 50 $PUSH tokens for creating a Channel in
              Push Network
            </p>

            {error && error !== "undefined" && <p>{error}</p>}
          </div>
        );
      } else if (step === "6") {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1300px",
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
                color: "white",
                textAlign: "center",
              }}
            >
              Confirm your channel details
            </h1>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "20px",
                borderRadius: "10px",
                border: "2px dashed #00ffff",
                width: "1200px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",

                  padding: "20px",
                  borderRadius: "10px",

                  width: "800px",
                }}
              >
                <p
                  style={{
                    fontSize: "40px",
                    color: "white",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    alignItems: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize: "60px",
                      color: "#00FF00",
                    }}
                  >
                    Name:
                  </span>{" "}
                  {state?.name ?? ""}
                </p>
                <p
                  style={{
                    fontSize: "40px",
                    color: "white",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    alignItems: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize: "60px",
                      color: "#00FF00",
                    }}
                  >
                    Info:
                  </span>{" "}
                  {state?.description ?? ""}
                </p>
                <p
                  style={{
                    fontSize: "40px",
                    color: "white",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    alignItems: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize: "60px",
                      color: "#00FF00",
                    }}
                  >
                    Website:
                  </span>{" "}
                  {state?.website ?? ""}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "20px",
                  borderRadius: "10px",

                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "60px",
                    color: "white",
                  }}
                >
                  Channel Icon
                </p>
                <img
                  src={state.icon ?? ""}
                  alt=""
                  width={"220px"}
                  height={"220px"}
                />
              </div>
            </div>
          </div>
        );
      } else if (step === "7") {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "1200px",
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
                color: "white",
              }}
            >
              Channel Created Successfully!
            </h1>
          </div>
        );
      }

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
