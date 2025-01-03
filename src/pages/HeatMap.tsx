import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "tailwindcss/tailwind.css";
import { PincodeData } from "../PincodeData";
import { getUserCountByPincode } from "../static/Functions";
import { stateToIdMapping } from "../static/Variables";

const HeatMap: React.FC = () => {
  const [pinCodeCount, setPinCodeCount] = useState<Record<string, number>>({});
  const [statePinCodeCount, setStatePinCodeCount] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    getUserCountByPincode().then((data) => {
      setPinCodeCount(data);
    });
  }, []);

  useEffect(() => {
    const parseCSV = () => {
      Papa.parse(PincodeData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const stateCounts: Record<string, number> = {};
          result.data.forEach((row: any) => {
            const stateName = row.State?.trim().toUpperCase();
            const pincode = row.Pincode?.trim();
            const id = stateToIdMapping[stateName];

            if (id && pincode && pinCodeCount[pincode]) {
              stateCounts[id] = (stateCounts[id] || 0) + pinCodeCount[pincode];
              delete pinCodeCount[pincode];
            }
          });
          setStatePinCodeCount(stateCounts);
        },
        error: (error: any) => {
          console.error("Error parsing CSV:", error);
        },
      });
    };

    if (Object.keys(pinCodeCount).length > 0) {
      parseCSV();
    }
  }, [pinCodeCount]);

  useEffect(() => {
    if (window.am4core && window.am4maps && statePinCodeCount) {
      const am4core = window.am4core;
      const am4maps = window.am4maps;
      const am4geodata_india2019High = window.am4geodata_india2019High;
      const am4themes_animated = window.am4themes_animated;

      am4core.useTheme(am4themes_animated);

      const chart = am4core.create("chartdiv", am4maps.MapChart);
      chart.geodata = am4geodata_india2019High;

      const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;

      polygonSeries.data = Object.entries(statePinCodeCount).map(
        ([id, count]) => ({
          id,
          value: count,
        })
      );

      polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: chart.colors.getIndex(1).brighten(1),
        max: chart.colors.getIndex(1).brighten(-0.3),
      });

      const polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.events.on("over", function (event: any) {
        const polygon = event.target;
        const value = polygon.dataItem?.dataContext?.value;
        if (value > 0) {
          polygon.tooltipText = `${polygon.dataItem.dataContext.name}: ${value}`;
        } else {
          // polygon.tooltipText = polygon.dataItem.dataContext.name;
          polygon.tooltipText = `${polygon.dataItem.dataContext.name}: 0`;
        }
      });
      polygonTemplate.nonScalingStroke = true;
      polygonTemplate.strokeWidth = 0.5;

      const hs = polygonTemplate.states.create("hover");
      hs.properties.fill = am4core.color("#3c5bdc");

      const imageSeries = chart.series.push(new am4maps.MapImageSeries());
      imageSeries.mapImages.template.nonScaling = true;

      const label = imageSeries.mapImages.template.createChild(am4core.Label);
      label.text = `{name}\n{value}`;
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.textAlign = "middle";
      label.fontSize = 14;
      // label.fill = am4core.color("#FFFFFF");
      label.nonScaling = true;

      imageSeries.data = polygonSeries.data.map((item: any) => {
        const stateFeature = chart.geodata.features.find(
          (feature: any) => feature.id === item.id
        );

        if (stateFeature) {
          const centroid = stateFeature.geometry.coordinates[0];
          const center = centroid.reduce(
            (acc: { lat: number; lon: number }, coord: [number, number]) => {
              acc.lat += coord[1];
              acc.lon += coord[0];
              return acc;
            },
            { lat: 0, lon: 0 }
          );

          const numPoints = centroid.length;
          return {
            id: item.id,
            name: chart.geodata.features.find(
              (feature: any) => feature.id === item.id
            )?.properties.name,
            latitude: center.lat / numPoints,
            longitude: center.lon / numPoints,
            value: item.value,
          };
        }

        return {};
      });

      imageSeries.mapImages.template.propertyFields.latitude = "latitude";
      imageSeries.mapImages.template.propertyFields.longitude = "longitude";

      return () => {
        chart.dispose();
      };
    }
  }, [statePinCodeCount]);

  return <div id="chartdiv" className="w-full h-screen bg-gray-100"></div>;
};

export default HeatMap;
