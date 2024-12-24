import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../Firebase";

interface Message {
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useSelector((state: RootState) => state?.auth?.user);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() && user?.email) {
      try {
        setLoading(true);

        const chatCollection = collection(db, "chat");
        const chatQuery = query(
          chatCollection,
          where("userEmail", "==", user.email),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(chatQuery);

        let currentTicket: any = null;
        if (!querySnapshot.empty) {
          currentTicket = querySnapshot.docs[0];
        }

        if (currentTicket && currentTicket.data().status === "closed") {
          const newTicketRef = doc(chatCollection);
          await setDoc(newTicketRef, {
            userEmail: user.email,
            status: "open",
            assignedTo: null,
            messages: [
              {
                sender: "user",
                content: message,
                timestamp: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else if (currentTicket) {
          const currentTicketRef = doc(db, "chat", currentTicket.id);
          await updateDoc(currentTicketRef, {
            messages: arrayUnion({
              sender: "user",
              content: message,
              timestamp: new Date(),
            }),
            updatedAt: new Date(),
          });
        } else {
          const newTicketRef = doc(chatCollection);
          await setDoc(newTicketRef, {
            userEmail: user.email,
            status: "open",
            assignedTo: null,
            messages: [
              {
                sender: "user",
                content: message,
                timestamp: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        setMessage("");
      } catch (error) {
        console.error("Error handling message:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user?.email) {
      const chatCollection = collection(db, "chat");
      const chatQuery = query(
        chatCollection,
        where("userEmail", "==", user.email),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          if (data?.messages) {
            setMessages(data.messages);
          }
        });
      });

      return () => unsubscribe();
    }
  }, [user?.email]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div
          onClick={toggleChat}
          className="bg-blue-500 w-5 h-5 flex justify-center fixed right-6 mt-1 items-center rounded-full text-white cursor-pointer"
        >
          x
        </div>
      ) : (
        <div
          onClick={toggleChat}
          className="bg-blue-500 p-3 rounded-full text-white cursor-pointer"
        >
          Chat
        </div>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg p-4 flex flex-col">
          <div className="flex-1 overflow-auto mb-4">
            {messages?.length === 0 && (
              <div className="text-gray-600 mt-4">
                Chat messages will appear here...
              </div>
            )}
            <div className="space-y-2">
              {messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md ${
                    msg.sender === "user"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.sender === "user" ? "You" : "1EQ"}: {msg.content}
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              className="border rounded-l-md w-full px-2 py-1"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-1 rounded-r-md"
            >
              {loading ? (
                <div className="flex w-full flex-wrap justify-center items-center">
                  <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
