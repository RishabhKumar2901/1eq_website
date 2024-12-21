import { useEffect, useState } from "react";
import { app } from "../Firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Papa from "papaparse";
import { Chart } from "react-google-charts";
import { PincodeData } from "../PincodeData";
import Navbar from "../components/Navbar";

type PinCodeCount = Record<string, number>;

const UserMap = () => {
  const [pinCodeCount, setPinCodeCount] = useState<PinCodeCount>({});
  const [statePinCodeCount, setStatePinCodeCount] = useState<PinCodeCount>({});
  const [loading, setLoading] = useState<boolean>(true);

  const getUserCountByPincode = async (): Promise<PinCodeCount> => {
    const db = getFirestore(app);
    const userSnapshot = await getDocs(collection(db, "users"));
    const pinCodeCount: PinCodeCount = {};

    userSnapshot.forEach((doc) => {
      const userData = doc.data();
      const pincode = userData?.pincode;
      pinCodeCount[pincode] = (pinCodeCount[pincode] || 0) + 1;
    });

    return pinCodeCount;
  };

  useEffect(() => {
    const parseCSV = () => {
      Papa.parse(PincodeData, {
        complete: (result: any) => {
          const stateCount: PinCodeCount = { ...statePinCodeCount };
          const headers = result.meta.fields || [];
          const stateIndex = headers.indexOf("statename");
          const pincodeIndex = headers.indexOf("pincode");

          if (stateIndex === -1 || pincodeIndex === -1) {
            console.error("Missing 'statename' or 'pincode' in CSV.");
            return;
          }

          result.data.forEach((row: any) => {
            const state = row[headers[stateIndex]]?.trim().toUpperCase();
            const pincode = row[headers[pincodeIndex]];

            if (state && pincode && pinCodeCount[pincode]) {
              if (stateCount[state]) {
                stateCount[state] = stateCount[state] + pinCodeCount[pincode];
              } else {
                stateCount[state] = pinCodeCount[pincode];
              }
              delete pinCodeCount[pincode];
            }
          });
          setStatePinCodeCount(stateCount);
          setLoading(false);
        },
        header: true,
        skipEmptyLines: true,
      });
    };

    if (PincodeData) {
      parseCSV();
    }
  }, [pinCodeCount]);

  useEffect(() => {
    getUserCountByPincode().then(setPinCodeCount);
  }, []);

  const geoData = [
    ["State", "Users"],
    ...Object.entries(statePinCodeCount).map(([state, count]) => [
      state,
      count,
    ]),
  ];

  return (
    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-4/5 lg:w-3/4 mx-auto">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          User Distribution in India
        </h1>

        {loading ? (
          <div className="flex w-full flex-wrap justify-center items-center h-96">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        ) : (
          <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <Chart
              chartType="GeoChart"
              data={geoData}
              options={{
                region: "IN",
                displayMode: "regions",
                resolution: "provinces",
                colorAxis: {
                  colors: ["#ffcccc", "#ff3300"],
                },
                tooltip: { trigger: 'focus' },
              }}
            />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default UserMap;
