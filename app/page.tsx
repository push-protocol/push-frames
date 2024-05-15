"use client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {extractDynamicArgs} from "@/lib/utils";
import {usePrivy} from "@privy-io/react-auth";
import {useState} from "react";
interface ResponseData {
  command: string;
  url: string;
}

interface ApiResponse {
  response: ResponseData | null;
  message: string;
  status: number;
}

export default function Home() {
  const {authenticated, user, ready, login} = usePrivy();
  const [command, setCommand] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState<ApiResponse>({
    response: null,
    message: "",
    status: 0,
  });
  const submitForm = async () => {
    if (!user?.email?.address && !user?.wallet?.address) return;
    if (!command || !url) return;

    const res = await fetch("/api/register-frame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_MASTER_API_KEY || "",
      },
      body: JSON.stringify({
        command: `/${command}`,
        url,
        owner: user?.email?.address ?? user?.wallet?.address,
        description,
      }),
    });

    const data = await res.json();

    if (data) {
      if (data.status === 401) {
        setResponse({
          response: null,
          message: "Unauthorized",
          status: 401,
        });
      } else if (data.status === 400) {
        setCommand("");

        setResponse({
          response: null,
          message: "Command already exists",
          status: 400,
        });
      } else if (data.status === 500) {
        setResponse({
          response: null,
          message: "Internal server error",
          status: 500,
        });
      } else {
        setCommand("");
        setUrl("");
        setDescription("");
        setResponse({
          response: {
            command: data.command,
            url: data.url,
          },
          message: "Frame registered successfully",
          status: 200,
        });
      }
    }
    console.log(data);
  };
  return (
    <main className="flex flex-col items-center justify-center max-w-[80%] m-auto mt-24">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Add your frame to Push Registry
      </h2>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        How it works?
      </h4>
      <ol className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Register your frame, choose a command (eg: /pay)</li>
        <li>If your frame url will have dynamic values, add them here.</li>
        <li>
          Once submitted, any user in Push Chat can just say /pay or whatever
          your command is and embed your frame in a chat.
        </li>
      </ol>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Example Frame URL :{" "}
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold">
          https://frames.push.org/channel/0xabc
        </code>{" "}
      </h4>
      <ol className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Let me choose /channel as my command</li>
        <li>
          0xabc in this URL is dynamic, meaning i want to give user to pass a
          value for that.
        </li>
        <li>
          So I&apos;ll enter
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            https://frames.push.org/channel
          </code>{" "}
          as baseURL and add a dynamic param value and name it as{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            channelAddress
          </code>
          My final URL will look like this{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            https://frames.push.org/channel/${"{channelAddress}"}
          </code>
        </li>
        <li>
          Now, when a user types{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            /channel 0xabc
          </code>{" "}
          in Push Chat, the frame will load this frame.
        </li>
      </ol>
      {authenticated && (
        <div className="flex flex-col justify-center items-center w-[40%]">
          <Input
            type="text"
            className="mb-4 mt-4  border-2 border-gray-300 focus:border-primary-500"
            placeholder="command (eg: channel)"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={!authenticated || !ready}
          />

          <Input
            type="text"
            className="mb-4  border-2 border-gray-300 focus:border-primary-500"
            placeholder="constructed url eg: https://frames.push.org/channel/${channelAddress}"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={!authenticated || !ready}
          />
          <Textarea
            className="mb-4  border-2 border-gray-300 focus:border-primary-500"
            placeholder="description of your frame"
            disabled={!authenticated || !ready}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {response.status === 200 ? (
            <div>
              <p className="text-green-500 text-sm">{response.message}</p>
              <p className="text-green-500 text-sm">
                you can now do {response?.response?.command}{" "}
                {extractDynamicArgs(response?.response?.url!).join(" ")}.
              </p>
            </div>
          ) : response.status === 400 || response.status === 401 ? (
            <p className="text-red-500 text-sm">{response.message}</p>
          ) : response.status === 500 ? (
            <p className="text-red-500 text-sm">{response.message}</p>
          ) : null}
          <Button
            variant="default"
            onClick={submitForm}
            className="my-2"
            disabled={!authenticated || !ready}
          >
            Submit
          </Button>
        </div>
      )}{" "}
      {!authenticated && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-red-500 text-sm">
            You need to be authenticated to submit a frame.
          </p>
          <Button onClick={login}>login</Button>
        </div>
      )}
    </main>
  );
}
