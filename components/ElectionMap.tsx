"use client";

import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import ReactMap, {
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  MapLayerMouseEvent,
  Source,
  Layer,
} from "react-map-gl/maplibre";
import type { FeatureCollection } from "geojson";
import type { ProvinceElectionData } from "@/lib/election-data";
import { cityData } from "@/lib/city-data";
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

  // Derive cities for selected province
  const citiesGeoJson = useMemo(() => {
    if (!selectedId) return null;
    const cities = cityData.filter((c) => c.provinceId === selectedId);
    return {
      type: "FeatureCollection",
      features: cities.map((city, index) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: city.coordinates,
        },
        properties: {
          name: city.name,
          id: index,
        },
      })),
    };
  }, [selectedId]);

  // Calculate province bounds and feature mapping
  const provinceFeatureIds = useMemo(() => {
    const featureMap = new Map<string, string>(); // Map fips -> fips
    const boundsMap = new Map<string, [number, number, number, number]>();

    if (!geoJson) return { featureMap, boundsMap };

    geoJson.features.forEach((feature: any) => {
      const provinceId = feature.properties?.fips;
      if (provinceId) {
        featureMap.set(provinceId, provinceId);

        if (feature.geometry?.type === "Polygon") {
          const coordinates = feature.geometry.coordinates[0];
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
          coordinates.forEach(([lon, lat]: [number, number]) => {
            minX = Math.min(minX, lon);
            minY = Math.min(minY, lat);
            maxX = Math.max(maxX, lon);
            maxY = Math.max(maxY, lat);
          });
          boundsMap.set(provinceId, [minX, minY, maxX, maxY]);
        } else if (feature.geometry?.type === "MultiPolygon") {
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
          feature.geometry.coordinates.forEach((polygon: any[]) => {
            polygon[0].forEach(([lon, lat]: [number, number]) => {
              minX = Math.min(minX, lon);
              minY = Math.min(minY, lat);
              maxX = Math.max(maxX, lon);
              maxY = Math.max(maxY, lat);
            });
          });
          boundsMap.set(provinceId, [minX, minY, maxX, maxY]);
        }
      }
    });
    return { featureMap, boundsMap };
  }, [geoJson]);

  // Handle click on provinces
  const onClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      // Prevent selection change if clicking a city (custom source check)
      if (feature && feature.source === "election-cities") return;

      if (!feature) {
        setSelectedId(null);
        onProvinceSelect(null);
        mapRef.current?.getMap().flyTo({
          center: [102.6, 18.5],
          zoom: 6,
          duration: 1000,
        });
        return;
      }

      const provinceId = feature.properties?.fips;

      if (selectedId === provinceId) {
        setSelectedId(null);
        onProvinceSelect(null);
        mapRef.current?.getMap().flyTo({
          center: [102.6, 18.5],
          zoom: 6,
          duration: 1000,
        });
      } else {
        setSelectedId(provinceId);
        onProvinceSelect(provinceId);
      }
    },
    [selectedId, onProvinceSelect],
  );

  // Fly to province when selected
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !selectedId) return;

    const bounds = provinceFeatureIds.boundsMap.get(selectedId);
    if (bounds) {
      const [minX, minY, maxX, maxY] = bounds;
      const padding = 50;

      map.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        {
          padding: {
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
          },
          duration: 1000,
        },
      );
    }
  }, [selectedId, provinceFeatureIds]);

  // Update feature state when selection changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !map.getSource("laos-provinces")) return;

    provinceFeatureIds.featureMap.forEach((featureId) => {
      map.setFeatureState(
        { source: "laos-provinces", id: featureId },
        { selected: false },
      );
    });

    if (selectedId) {
      const featureId = provinceFeatureIds.featureMap.get(selectedId);
      if (featureId !== undefined) {
        map.setFeatureState(
          { source: "laos-provinces", id: featureId },
          { selected: true },
        );
      }
    }
  }, [selectedId, provinceFeatureIds]);

  // Hover state effect
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !map.getSource("laos-provinces")) return;

    provinceFeatureIds.featureMap.forEach((featureId) => {
      map.setFeatureState(
        { source: "laos-provinces", id: featureId },
        { hovered: false },
      );
    });

    if (hoveredId) {
      const featureId = provinceFeatureIds.featureMap.get(hoveredId);
      if (featureId !== undefined) {
        map.setFeatureState(
          { source: "laos-provinces", id: featureId },
          { hovered: true },
        );
      }
    }
  }, [hoveredId, provinceFeatureIds]);

  // Interaction Handlers (Mouse Move/Leave)
  const onMouseMove = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature && feature.source === "laos-provinces") {
      setHoveredId(feature.properties?.fips);
    } else {
      setHoveredId(null);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

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
          promoteId: "fips",
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
              ["boolean", ["feature-state", "hovered"], false],
              2,
              1,
            ] as any,
          },
        },
      ],
    };
  }, [geoJson, fillColorExpression]);

  const parties = useMemo(() => {
    const uniqueParties = new Map<string, string>();
    electionData.forEach((d) => {
      uniqueParties.set(d.winningParty, d.partyColor);
    });
    return Array.from(uniqueParties.entries());
  }, [electionData]);

  return (
    <div className="w-full h-full relative group bg-zinc-100 dark:bg-zinc-950">
      <ReactMap
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
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <ScaleControl position="bottom-right" />
        <FullscreenControl position="top-right" />

        {/* City Markers Layer - Overlay on top of base styles */}
        {citiesGeoJson && (
          <Source
            id="election-cities"
            type="geojson"
            data={citiesGeoJson as any}
          >
            <Layer
              id="cities-circle"
              type="circle"
              paint={{
                "circle-color": "#ffffff",
                "circle-radius": 5,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#000000",
              }}
            />
            <Layer
              id="cities-label"
              type="symbol"
              layout={{
                "text-field": ["get", "name"],
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 12,
                "text-offset": [0, 1.25],
                "text-anchor": "top",
              }}
              paint={{
                "text-color": "#000000",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
              }}
            />
          </Source>
        )}
      </ReactMap>

      {/* Modern Glassmorphic Legend Overlay */}
      <div className="absolute top-6 left-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 min-w-[200px] animate-fadeIn transition-all hover:bg-white/95 dark:hover:bg-zinc-900/95">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">
            Lao Election Map
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-4">
            2026 Provincial Results
          </p>

          <div className="space-y-3">
            <div className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
              Leading Parties
            </div>
            {parties.map(([party, color]) => (
              <div key={party} className="flex items-center gap-3 group">
                <span
                  className="w-3 h-3 rounded-full shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {party}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Click province for details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
