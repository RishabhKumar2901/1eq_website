import { useEffect, useState } from "react";
import Papa from "papaparse";
import { PincodeData } from "../PincodeData2";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { getUserCountByPincode } from "../static/Functions";

type GeoData = {
    Id: number;
    State: string;
    Area: string;
    Total_Users: string;
    Latitude: number;
    Longitude: number;
};

const PointerMap = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [geoData, setGeoData] = useState<GeoData[]>([]);

    useEffect(() => {
        const processGeoData = async () => {
            const pinCodeCount = await getUserCountByPincode();
            Papa.parse(PincodeData, {
                complete: (result: any) => {
                    const headers = result.meta.fields || [];
                    const stateIndex = headers.indexOf("State");
                    const areaIndex = headers.indexOf("CityName/AreaName");
                    const pincodeIndex = headers.indexOf("Pincode");
                    const latitudeIndex = headers.indexOf("Latitude");
                    const longitudeIndex = headers.indexOf("Longitude");

                    if (stateIndex === -1 || areaIndex === -1 || pincodeIndex === -1 || latitudeIndex === -1 || longitudeIndex === -1) {
                        console.error("Missing required fields in CSV.");
                        return;
                    }

                    const aggregatedData: Record<string, GeoData> = {};
                    let id = 1;

                    result.data.forEach((row: any) => {
                        const state = row[headers[stateIndex]]?.trim().toUpperCase();
                        const area = row[headers[areaIndex]]?.trim().toUpperCase();
                        const pincode = row[headers[pincodeIndex]];
                        const latitude = parseFloat(row[headers[latitudeIndex]]);
                        const longitude = parseFloat(row[headers[longitudeIndex]]);

                        if (state && pincode && pinCodeCount[pincode]) {
                            if (!aggregatedData[state]) {
                                aggregatedData[state] = {
                                    Id: id++,
                                    State: state,
                                    Area: area,
                                    Total_Users: pinCodeCount[pincode].toString(),
                                    Latitude: latitude,
                                    Longitude: longitude,
                                };
                            } else {
                                aggregatedData[state].Total_Users = (
                                    parseInt(aggregatedData[state].Total_Users) +
                                    pinCodeCount[pincode]
                                ).toString();
                            }
                        }
                    });

                    setGeoData(Object.values(aggregatedData));
                    setLoading(false);
                },
                header: true,
                skipEmptyLines: true,
            });
        };

        processGeoData();
    }, []);

    useEffect(() => {
        getUserCountByPincode();
    }, []);

    return (
        <>
            {loading ? (
                <div className="flex w-full flex-wrap justify-center items-center h-96">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
                    <MapContainer center={[20.593683, 78.962883]} zoom={5} style={{ width: '100%', height: '69vh' }}>
                        <TileLayer
                            // attribution='© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                            url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                        />
                        {geoData?.map((data) => (
                            <Marker key={data?.Id} position={[data?.Latitude, data?.Longitude]}>
                                <Popup>
                                    <div>
                                        <p>{data?.State}</p>
                                        <p>{data?.Area}</p>
                                        <p>Total Users: {data?.Total_Users}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}

        </>
    );
};

export default PointerMap;