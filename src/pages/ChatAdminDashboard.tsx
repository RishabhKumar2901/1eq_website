import { useEffect, useState } from "react";
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
    onSnapshot,
    orderBy
} from "firebase/firestore";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Message {
    sender: "employee" | "bot" | "user";
    content: string;
    timestamp: Date;
}

const ChatEmployeeDashboard = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isTicketClosed, setIsTicketClosed] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state?.auth?.user);

    useEffect(() => {
        const fetchAssignedTickets = async () => {
            if (user?.email) {
                try {
                    const chatQuery = query(
                        collection(db, "chat"),
                        where("assignedTo", "==", user.email),
                        orderBy("createdAt", "desc")
                    );
                    const chatDocsSnapshot = await getDocs(chatQuery);
                    const ticketsData = chatDocsSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setTickets(ticketsData);
                } catch (error) {
                    console.error("Error fetching assigned tickets:", error);
                }
            }
        };

        fetchAssignedTickets();

        const unsubChatSnapshot = onSnapshot(
            query(collection(db, "chat")),
            (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "modified" || change.type === "added") {
                        const updatedChatDocRef = doc(db, "chat", change.doc.id);
                        getDoc(updatedChatDocRef).then((docSnapshot) => {
                            if (docSnapshot.exists()) {
                                setMessages(() => {
                                    const newMessages = docSnapshot.data()?.messages || [];
                                    return newMessages;
                                });
                            }
                        });
                    }
                });
            }
        );

        return () => unsubChatSnapshot();
    }, [user?.email, isTicketClosed]);

    const handleChatOpen = async (ticketId: string) => {
        setActiveChat(ticketId);
        try {
            const chatDocRef = doc(db, "chat", ticketId);
            const docSnapshot = await getDoc(chatDocRef);
            if (docSnapshot.exists()) {
                setMessages(docSnapshot.data()?.messages || []);
            }
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() && activeChat) {
            try {
                setLoading(true);
                const chatDocRef = doc(db, "chat", activeChat);
                await updateDoc(chatDocRef, {
                    messages: arrayUnion({
                        sender: "employee",
                        content: message,
                        timestamp: new Date(),
                    }),
                    updatedAt: new Date(),
                });
                setMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const closeTicket = async (ticketId: string) => {
        try {
            const ticketRef = doc(db, "chat", ticketId);
            await updateDoc(ticketRef, { status: "closed" });
            setIsTicketClosed(true);
            alert("Ticket closed successfully.")
        } catch (error) {
            console.error("Error closing ticket:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/4 bg-white p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
                <ul className="space-y-4">
                    {tickets.map((ticket) => (
                        <li
                            key={ticket.id}
                            className="bg-gray-100 p-4 shadow rounded"
                        >
                            <p>
                                <strong>Customer ID:</strong> {ticket.id}
                            </p>
                            <p>
                                <strong>Status:</strong> {ticket.status}
                            </p>
                            <button
                                onClick={() => handleChatOpen(ticket.id)}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Chat with Customer
                            </button>
                            <button
                                onClick={() => closeTicket(ticket.id)}
                                className="mt-2 ml-2 bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Close Ticket
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="w-3/4 bg-white p-6 overflow-auto">
                {activeChat && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            Chat with Ticket {activeChat}
                        </h2>
                        <div className="flex-1 h-full mb-4 overflow-auto">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-2 rounded-md mt-2 ${
                                        msg.sender === "employee"
                                            ? "bg-blue-200 text-blue-800"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {msg.sender === "employee" ? "You" : "Customer"}: {msg.content}
                                </div>
                            ))}
                        </div>

                        <div className="flex">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
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
        </div>
    );
};

export default ChatEmployeeDashboard;
