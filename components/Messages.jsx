import { useRef, useState } from "react";
import { ByMoralis, useMoralis, useMoralisQuery } from "react-moralis";
import Message from "./Message";
import SendMessage from "./SendMessage";

function Messages() {
  const { user } = useMoralis();
  const endOfMessagesRef = useRef(null);
  const [minDuration, setMinDuration] = useState(15);

  const { data, loading, error } = useMoralisQuery(
    "Messages",
    (query) =>
      // Only fetch the last 15 minutes of messages
      query
        .ascending("createdAt")
        .greaterThan(
          "createdAt",
          new Date(Date.now() - minDuration * 60 * 1000)
        ),
    [minDuration],
    {
      live: true,
    }
  );

  console.log("datas", data, "minDuration", minDuration);

  const updateDuration = () => {
    if (data.length === 0) {
      setMinDuration(500);
    } else {
      setMinDuration(minDuration + 15);
    }
  };

  return (
    <div className="pb-56">
      <div className="my-5">
        <ByMoralis
          variant="dark"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        />
      </div>

      <div className="flex justify-center align-center pt-1 rounded-full bg-gray-100 w-8 h-8 mx-auto text-center text-gray-400">
        <button onClick={updateDuration}>^</button>
      </div>

      <div className="space-y-10 p-4">
        {data.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      <div className="flex justify-center">
        <SendMessage endOfMessagesRef={endOfMessagesRef} />
      </div>

      <div ref={endOfMessagesRef} className="text-center text-gray-400">
        <p>
          {data.length > 0
            ? `You're up to date ${user.getUsername()}!`
            : "Show previous messages"}
        </p>
      </div>
    </div>
  );
}

export default Messages;
