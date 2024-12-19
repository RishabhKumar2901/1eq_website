import React, { useState, useEffect } from "react";

interface PopupProps {
  word: any;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ word }) => {
  const [meaning, setMeaning] = useState<string | null>(word?.meaning || null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMeaning = async () => {
      if (!meaning) {
        try {
          setLoading(true);
          const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word?.word}`
          );
          const data = await response.json();
          if (
            data &&
            data?.[0] &&
            data?.[0]?.meanings &&
            data?.[0]?.meanings?.[0]?.definitions
          ) {
            setMeaning(data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition);
          }
        } catch (err) {
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMeaning();
  }, [word, meaning]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 w-full">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {loading ? (
          <div className="flex flex-wrap justify-center items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold">{word?.word}</h2>

            <p className="mt-2">
              <strong>Meaning:</strong> {meaning || "No meaning available."}
            </p>

            {word?.assignedTo && (
              <div className="mt-2">
                <strong>Assigned to:</strong> {word?.assignedTo}
              </div>
            )}

            {word?.url && (
              <iframe
                className="mt-4 h-80 w-full"
                src={word?.url}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Popup;
