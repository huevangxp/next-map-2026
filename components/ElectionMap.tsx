"use client";

import { useMemo, useCallback } from "react";
import Map, {
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  Source,
  Layer,
  FillLayer,
  LineLayer,
} from "react-map-gl/maplibre";
import type { FeatureCollection } from "geojson";
import type { ProvinceElectionData } from "@/lib/election-data";
import "maplibre-gl/dist/maplibre-gl.css";

interface ElectionMapProps {
  geoJson: FeatureCollection;
  electionData: ProvinceElectionData[];
  onProvinceSelect: (provinceId: string | null) => void;
}

export default function ElectionMap({
  geoJson,
  electionData,
  onProvinceSelect,
}: ElectionMapProps) {
  const dataLayer: FillLayer = useMemo(() => {
    return {
      id: "data",
      type: "fill",
      paint: {
        "fill-color": [
          "match",
          ["get", "fips"], // Assuming property 'fips' from geojson matches 'id' in electionData
          ...electionData.flatMap((d) => [d.id, d.partyColor]),
          "#cccccc", // Default color
        ],
        "fill-opacity": 0.7,
        "fill-outline-color": "#FFFFFF",
      },
    };
  }, [electionData]);

  const borderLayer: LineLayer = {
    id: "outline",
    type: "line",
    paint: {
      "line-color": "#ffffff",
      "line-width": 1,
    },
  };

  const onClick = useCallback(
    (event: any) => {
      const feature = event.features && event.features[0];
      if (feature) {
        // Assuming 'fips' is the unique identifier in your GeoJSON properties
        onProvinceSelect(feature.properties.fips);
      } else {
        onProvinceSelect(null);
      }
    },
    [onProvinceSelect],
  );

  return (
    <div className="w-full h-full relative group">
      <Map
        initialViewState={{
          longitude: 102.6,
          latitude: 18.5,
          zoom: 6,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        interactiveLayerIds={["data"]}
        onClick={onClick}
      >
        <Source type="geojson" data={geoJson}>
          <Layer {...dataLayer} />
          <Layer {...borderLayer} />
        </Source>

        <NavigationControl position="top-right" />
        <ScaleControl />
        <FullscreenControl position="top-right" />
      </Map>

      {/* Overlay to show Lao colors integration */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 z-10 pointer-events-none">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
          Lao PDR Election Map
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          Click on a province to see details
        </p>
        <div className="flex gap-2">
          <div
            className="w-6 h-6 rounded-full bg-lao-red shadow-sm transform hover:scale-110 transition-transform"
            title="Lao Red"
          ></div>
          <div
            className="w-6 h-6 rounded-full bg-lao-blue shadow-sm transform hover:scale-110 transition-transform"
            title="Lao Blue"
          ></div>
          <div
            className="w-6 h-6 rounded-full bg-lao-white border border-gray-200 shadow-sm transform hover:scale-110 transition-transform"
            title="Lao White"
          ></div>
        </div>
      </div>
    </div>
  );
}
