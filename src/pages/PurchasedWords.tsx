import { useEffect, useState } from "react";
import Popup from "./WordExpandPopup";
import Navbar from "../components/Navbar";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/slices/dataSlice";
import Chatbot from "./Chatbot";

const PurchasedWords = () => {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const words = useSelector((state: RootState) => state?.data);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state?.auth?.user);

  const handleWordClick = (word: string) => {
    setExpandedWord(expandedWord === word ? null : word);
  };

  useEffect(() => {
    dispatch(fetchData("words"));
  }, [dispatch]);

  const isPurchased = (item: any) => {
    return (
      item?.assignedTo &&
      (item?.assignedTo === user?.email || item?.assignedTo === user?.uid)
    );
  };

  return (
    <div className="flex flex-col justify-center items-center relative">
      <Navbar onRefreshClick={() => dispatch(fetchData("words"))} />

      <div className="flex flex-col items-center w-full max-w-4xl mt-4 px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Purchased Words
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {words?.loading ? (
            <div className="flex w-full flex-wrap justify-center items-center h-96">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : words?.items?.length > 0 ? (
            words?.items
              .filter(isPurchased)
              .map((item, index) => (
                <div
                  key={index}
                  className="relative border-2 py-6 px-8 rounded-md bg-white shadow-md text-black cursor-pointer transition-all hover:bg-blue-50 active:bg-blue-100"
                  onClick={() => handleWordClick(item?.word)}
                >
                  <div
                    className={`${
                      isPurchased(item)
                        ? "text-blue-700 font-bold text-xl"
                        : "text-black"
                    }`}
                  >
                    {item?.word}
                  </div>

                  {isPurchased(item) && (
                    <div className="absolute top-2 right-2 text-xs bg-blue-200 text-blue-700 py-1 px-3 rounded-full">
                      Purchased
                    </div>
                  )}

                  {expandedWord === item?.word && (
                    <Popup word={item} onClose={() => setExpandedWord(null)} />
                  )}
                </div>
              ))
          ) : (
            <div className="flex justify-center items-center w-full h-screen text-2xl">
              No Purchased Words Found!
            </div>
          )}
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default PurchasedWords;
