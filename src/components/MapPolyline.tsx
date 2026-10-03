import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface MapPolylineProps {
  path: Array<{ lat: number; lng: number }>;
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
}

export const MapPolyline: React.FC<MapPolylineProps> = ({
  path,
  strokeColor = '#E37500',
  strokeWeight = 5,
  strokeOpacity = 0.9,
}) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        map,
        strokeColor,
        strokeWeight,
        strokeOpacity,
        geodesic: true,
      });
    } else {
      polylineRef.current.setPath(path);
      polylineRef.current.setMap(map);
      polylineRef.current.setOptions({ strokeColor, strokeWeight, strokeOpacity });
    }

    // Auto fit bounds to route
    if (path.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      path.forEach((pt) => bounds.extend(pt));
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, path, strokeColor, strokeWeight, strokeOpacity]);

  return null;
};
