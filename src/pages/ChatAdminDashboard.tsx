import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
    collection,
    doc,
    onSnapshot,
    updateDoc,
    query
} from "firebase/firestore";
import { db } from "../Firebase";
import { fetchData } from "../redux/slices/dataSlice";

interface Message {
    sender: "user" | "bot";
    content: string;
    timestamp: Date;
}

interface Ticket {
    id: string;
    userEmail: string;
    messages: Message[];
    assignedTo: string | null;
    status: "open" | "in_progress" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

const ChatAdminDashboard = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [assignedToMap, setAssignedToMap] = useState<{ [key: string]: string }>(
        {}
    );
    const users = useSelector((state: RootState) => state?.data?.items);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchData("users"));
    }, []);

    useEffect(() => {
        const chatCollection = collection(db, "chat");
        const chatQuery = query(chatCollection);
        const unsubChatSnapshot = onSnapshot(chatQuery, (snapshot) => {
            const updatedTicketsData: Ticket[] = [];
            const updatedAssignedToMap: { [key: string]: string } = { ...assignedToMap };

            snapshot.forEach((docSnapshot) => {
                const data = docSnapshot.data() as Ticket;
                updatedTicketsData.push({...data,id:docSnapshot?.id});
                if (data.assignedTo) {
                    updatedAssignedToMap[docSnapshot.id] = data.assignedTo;
                }
            });

            setTickets(updatedTicketsData);
            setAssignedToMap(updatedAssignedToMap);
        });

        return () => unsubChatSnapshot();
    }, []);

    const assignTicket = async (ticketId: string, employeeEmail: string) => {
        try {
            if (!employeeEmail) {
                alert("Please select an employee to assign the ticket to.");
                return;
            }
            const ticketRef = doc(db, "chat", ticketId);
            await updateDoc(ticketRef, {
                assignedTo: employeeEmail,
                status: "in_progress",
                updatedAt: new Date(),
            });
            alert(`Ticket ${ticketId} assigned to ${employeeEmail}`);
        } catch (error) {
            console.error("Error assigning ticket:", error);
        }
    };

    const handleAssignmentChange = (ticketId: string, employeeEmail: string) => {
        setAssignedToMap((prev) => ({ ...prev, [ticketId]: employeeEmail }));
        assignTicket(ticketId, employeeEmail);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <ul className="space-y-4">
                {tickets.map((ticket) => (
                    <li key={ticket?.id} className="bg-white p-4 shadow rounded flex flex-col">
                        <p>
                            <strong>Customer:</strong> {ticket?.userEmail}
                        </p>
                        <p>
                            <strong>Status:</strong> {ticket?.status}
                        </p>
                        {assignedToMap[ticket?.id] && (
                            <p>
                                <strong>Assigned To:</strong> {assignedToMap[ticket?.id]}
                            </p>
                        )}
                        {!assignedToMap[ticket?.id] && (
                            <>
                                <div className="flex items-center mt-2">
                                    <label htmlFor={`assignedTo-${ticket?.id}`} className="mr-2">
                                        <strong>Assigned To:</strong>
                                    </label>
                                    <select
                                        id={`assignedTo-${ticket.id}`}
                                        className="border-2 p-1"
                                        onChange={(e) => handleAssignmentChange(ticket.id, e.target.value)}
                                        value={assignedToMap[ticket.id] || ""}
                                    >
                                        <option value="">Select an option</option>
                                        {users.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.id}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatAdminDashboard;
