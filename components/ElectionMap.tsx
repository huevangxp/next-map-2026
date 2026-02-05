```
"use client";

import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import Map, {
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import type {
  FillLayerSpecification as FillLayer,
  LineLayerSpecification as LineLayer,
} from "maplibre-gl";
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
  const mapRef = useRef<any>(null);

  const mapStyle = useMemo(() => {
    return {
      version: 8 as const,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap contributors",
        },
        "laos-provinces": {
          type: "geojson",
          data: geoJson || { type: "FeatureCollection", features: [] },
        },
      },
      layers: [
        {
          id: "osm-tiles",
          type: "raster",
          source: "osm",
          minzoom: 0,
          maxzoom: 19,
        },
        {
          id: "data",
          type: "fill",
          source: "laos-provinces",
          paint: {
            "fill-color": [
              "match",
              ["get", "fips"],
              ...electionData.flatMap((d) => [d.id, d.partyColor]),
              "#cccccc",
            ],
            "fill-opacity": 0.7,
            "fill-outline-color": "#FFFFFF",
          },
        },
        {
          id: "outline",
          type: "line",
          source: "laos-provinces",
          paint: {
            "line-color": "#ffffff",
            "line-width": 1,
          },
        },
      ],
    };
  }, [geoJson, electionData]);

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
        ref={mapRef}
        initialViewState={{
          longitude: 102.6,
          latitude: 18.5,
          zoom: 6,
        }}
        minZoom={4}
        maxZoom={12}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle as any}
        interactiveLayerIds={["data"]}
        onClick={onClick}
      >
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
