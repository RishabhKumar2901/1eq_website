import React from "react";

interface PopupProps {
  word: any;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ word }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 w-full">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold">{word?.word}</h2>
        <p className="mt-2"><strong>Meaning:</strong> {word?.meaning}</p>
        {word?.purchasedby && (
          <div className="mt-2">
            <strong>Assigned to:</strong> {word?.purchasedby}
          </div>
        )}
        {word?.url && (
          <iframe
            className="mt-4 h-80 w-full"
            src={word?.url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Popup;
