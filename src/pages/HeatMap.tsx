import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Chart } from "react-google-charts";
import { PincodeData } from "../PincodeData";
import { getUserCountByPincode } from "../static/Functions";

type PinCodeCount = Record<string, number>;

const HeatMap = () => {
    const [pinCodeCount, setPinCodeCount] = useState<PinCodeCount>({});
    const [statePinCodeCount, setStatePinCodeCount] = useState<PinCodeCount>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const parseCSV = () => {
            Papa.parse(PincodeData, {
                complete: (result: any) => {
                    const stateCount: PinCodeCount = { ...statePinCodeCount };
                    const headers = result.meta.fields || [];
                    const stateIndex = headers.indexOf("State");
                    const pincodeIndex = headers.indexOf("Pincode");

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
        </>
    );
};

export default HeatMap;
