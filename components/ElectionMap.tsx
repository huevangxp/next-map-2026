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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sync selectedId from simple prop if needed, or manage it internally
  // Here we assume the parent controls selection, so we watch props.
  // Actually, let's track the internal state for featureState updates.

  // Effect to update selected feature state
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous selection
    if (selectedId) {
      const map = mapRef.current.getMap(); // react-map-gl ref exposes getMap()
      if (map && map.getSource("laos-provinces")) {
        map.setFeatureState(
          { source: "laos-provinces", id: selectedId },
          { selected: false },
        );
      }
    }

    // Set new selection
    // We need to know the ID passed from parent. Parent passes 'provinceId'.
    // We need to store previous selection to clear it.
    // Let's use a ref for previous selection to avoid re-renders or complicated dep arrays?
    // Actually, react-map-gl handles some of this, but raw mapbox/maplibre logic is robust.
  }, [selectedId]);

  // Better approach: Listen to onProvinceSelect from parent, but also need to know the *feature id* to set state.
  // The geojson features need 'id' property at top level for setFeatureState to work.
  // We assume the geojson features have numeric or string IDs.

  // Let's update the feature state when `hoveredId` changes.
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (hoveredId) {
      map.setFeatureState(
        { source: "laos-provinces", id: hoveredId },
        { hovered: true },
      );
    }

    return () => {
      if (hoveredId && map.getSource("laos-provinces")) {
        map.setFeatureState(
          { source: "laos-provinces", id: hoveredId },
          { hovered: false },
        );
      }
    };
  }, [hoveredId]);

  // Handle Selection Feature State
  // We need to find the feature ID corresponding to the selected province ID (fips).
  // This logic works best if the feature.id MATCHES the fips code.
  // If feature.id is not set or different, we must rely on 'promoteId' or matching properties.
  // For this example, let's assume feature.properties.fips IS the id we use.
  // We will iterate features to find the one to select? No, setFeatureState requires feature.id (top level).
  // If the geojson doesn't have top-level IDs, we can't use setFeatureState easily without promoteId.
  // Let's assume we configure the source with `promoteId: 'fips'`.

  // Derived expressions
  const fillColorExpression = useMemo(() => {
    return [
      "match",
      ["get", "fips"],
      ...electionData.flatMap((d) => [d.id, d.partyColor]),
      "#cccccc",
    ];
  }, [electionData]);

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
          promoteId: "fips", // CRITICAL: Use 'fips' property as the feature ID for state
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
            "fill-color": fillColorExpression as any,
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              0.8,
              ["boolean", ["feature-state", "hovered"], false],
              0.7,
              0.5,
            ] as any,
            "fill-outline-color": "#FFFFFF",
          },
        },
        {
          id: "outline",
          type: "line",
          source: "laos-provinces",
          paint: {
            "line-color": "#ffffff",
            "line-width": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              3,
              1,
            ] as any,
          },
        },
      ],
    };
  }, [geoJson, fillColorExpression]);

  // Interaction Handlers
  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features && event.features[0];
      if (feature) {
        const id = feature.properties?.fips;
        onProvinceSelect(id);

        // Update local selected state for visual feedback
        // First clear old
        const map = mapRef.current?.getMap();
        if (selectedId && map) {
          map.setFeatureState(
            { source: "laos-provinces", id: selectedId },
            { selected: false },
          );
        }

        if (id && map) {
          map.setFeatureState(
            { source: "laos-provinces", id },
            { selected: true },
          );
          setSelectedId(id);
        }
      } else {
        onProvinceSelect(null);
        // Clear selection
        const map = mapRef.current?.getMap();
        if (selectedId && map) {
          map.setFeatureState(
            { source: "laos-provinces", id: selectedId },
            { selected: false },
          );
        }
        setSelectedId(null);
      }
    },
    [onProvinceSelect, selectedId],
  );

  const onMouseMove = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature) {
      setHoveredId(feature.properties?.fips);
    } else {
      setHoveredId(null);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const getCursor = useCallback((event: any) => {
    return event.isHovering ? "pointer" : "grab";
  }, []);

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
