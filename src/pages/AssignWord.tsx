import { useState } from "react";
import Downshift from "downshift";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addData, fetchData } from "../redux/slices/dataSlice";
import { db } from "../Firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/store";
import Navbar from "../components/Navbar";

const AssignWord = () => {
  const [word, setWord] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const userId = useSelector((state: RootState) => state.auth.user?.email);
  const words = useSelector((state: RootState) => state.data.items);
  const dispatch = useDispatch<AppDispatch>();

  const fetchSuggestions = async (value: string) => {
    try {
      const response = await axios.get(`https://api.datamuse.com/words`, {
        params: { sp: `${value}*`, max: 10 },
      });
      setSuggestions(
        response?.data?.map((item: { word: string }) => item?.word)
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleInputValueChange = (inputValue: string | null) => {
    setWord(inputValue || "");
    if (inputValue && inputValue.trim() !== "") {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
    }
  };

  const generateOrderId = async (amount: number) => {
    try {
      const response = await axios.post(
        "https://api.razorpay.com/v1/orders",
        {
          amount: amount * 100,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          payment_capture: 1,
        },
        {
          auth: {
            username: "YOUR_RAZORPAY_KEY_ID",
            password: "YOUR_RAZORPAY_SECRET",
          },
        }
      );
      return response.data.id;
    } catch (error) {
      console.error("Error generating Razorpay order:", error);
      throw new Error("Failed to create order.");
    }
  };

  const openRazorpayCheckout = async (orderId: string, amount: number) => {
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: amount * 100,
      currency: "INR",
      name: "Word Purchase",
      description: `Purchase of the word: ${word}`,
      order_id: orderId,
      handler: async (response: any) => {
        try {
          console.log("Payment successful:", response);
          await assignWordToUser();
        } catch (error) {
          console.error("Error processing payment:", error);
          setMessage("Payment successful, but word assignment failed.");
        }
      },
      prefill: {
        email: userId,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const assignWordToUser = async () => {
    const existingWord = words?.find((item: any) => item?.word === word);

    if (existingWord) {
      if (existingWord.assignedTo) {
        setMessage(`Word '${word}' is already taken.`);
        return;
      }

      const wordDocRef = doc(db, "words", existingWord?.id);
      await updateDoc(wordDocRef, { assignedTo: userId });
      setMessage(`Word '${word}' has been successfully assigned to you.`);
      dispatch(fetchData("words"));
    } else {
      dispatch(
        addData({
          collectionName: "words",
          data: { word, assignedTo: userId },
        })
      );
      setMessage(`Word '${word}' has been created and assigned to you.`);
    }

    setWord("");
  };

  const handleAssignWord = async () => {
    if (!word.trim()) {
      setMessage("Word cannot be empty.");
      return;
    }

    const amount = 100;

    try {
      const orderId = await generateOrderId(amount);
      openRazorpayCheckout(orderId, amount);
    } catch (error) {
      console.error("Error processing Razorpay checkout:", error);
      setMessage("Failed to initiate payment.");
    }
  };

  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center h-96">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Purchase Word</h2>
        <Downshift
          inputValue={word}
          onInputValueChange={handleInputValueChange}
          onChange={(selectedItem) => setWord(selectedItem || "")}
          itemToString={(item) => (item ? item : "")}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            isOpen,
            highlightedIndex,
            selectedItem,
          }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: "Enter a word",
                  className:
                    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                })}
              />
              <ul
                {...getMenuProps()}
                className="border border-gray-300 mt-2 rounded-md shadow-md bg-white max-h-40 overflow-auto"
              >
                {isOpen &&
                  suggestions.map((item, index) => {
                    const itemProps = getItemProps({
                      index,
                      item,
                      className: `px-4 py-2 ${
                        highlightedIndex === index
                          ? "bg-blue-500 text-white"
                          : ""
                      }`,
                    });

                    return (
                      <li key={item} {...itemProps}>
                        {item}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </Downshift>
        <button
          onClick={handleAssignWord}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Purchase Word
        </button>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
    </>
  );
};

export default AssignWord;