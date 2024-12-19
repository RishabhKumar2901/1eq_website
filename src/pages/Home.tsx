import { useEffect, useState } from "react";
import Popup from "./WordExpandPopup";
import Navbar from "../components/Navbar";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../redux/slices/dataSlice";

const Home = () => {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const words = useSelector((state: RootState) => state?.data);
  const dispatch = useDispatch<AppDispatch>();

  const handleWordClick = (word: string) => {
    setExpandedWord(expandedWord === word ? null : word);
  };

  // const fetchWords = async () => {
  //   try {
  //     setLoading(true);
  //     const querySnapshot = await getDocs(collection(db, "words"));
  //     const fetchedWords: any[] = [];
  //     querySnapshot?.forEach((doc) => {
  //       fetchedWords.push(doc.data());
  //     });
  //     fetchedWords.sort(() => Math.random() - 0.5);
  //     const randomWords = fetchedWords.slice(0, 100);
  //     setWords(randomWords);
  //   } catch (error) {
  //     console.error("Error fetching words: ", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    dispatch(fetchData("words"));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
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
                style={{
                  color: item?.purchasedby && "blue",
                  fontWeight: item?.purchasedby && "700",
                }}
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
    </div>
  );
};

export default Home;
