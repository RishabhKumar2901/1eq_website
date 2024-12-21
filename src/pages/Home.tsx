import { useEffect, useState } from "react";
import Popup from "./WordExpandPopup";
import Navbar from "../components/Navbar";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/slices/dataSlice";
import Chatbot from "./Chatbot";

const Home = () => {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const words = useSelector((state: RootState) => state?.data);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state?.auth?.user);

  const handleWordClick = (word: string) => {
    setExpandedWord(expandedWord === word ? null : word);
  };

  useEffect(() => {
    dispatch(fetchData("words"));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center relative">
      <Navbar onRefreshClick={() => dispatch(fetchData("words"))} />

      <div className="flex gap-1 w-full flex-wrap mt-1 p-1 px-1.5">
        {words?.loading ? (
          <div className="flex w-full flex-wrap justify-center items-center h-96">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : words?.items?.length > 0 ? (
          words?.items?.map((item, index) => (
            <div
              key={index}
              className={`border-2 py-2 px-4 rounded-md bg-white text-black cursor-pointer transition-all grid items-center justify-center hover:bg-slate-100 active:bg-slate-100`}
              onClick={() => handleWordClick(item?.word)}
            >
              <div
                className={`${
                  item?.assignedTo &&
                  (item?.assignedTo == user?.email ||
                    item?.assignedTo == user?.uid)
                    ? "text-blue-700 font-bold text-xl"
                    : "text-black"
                }`}
              >
                {item?.word}
              </div>
              {expandedWord === item?.word && (
                <Popup word={item} onClose={() => setExpandedWord(null)} />
              )}
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center w-full h-screen text-2xl">
            No Word Found!
          </div>
        )}
      </div>

      <Chatbot />
    </div>
  );
};

export default Home;
