import React, { useMemo, useState, useCallback, useEffect } from "react";
import CircleMarker from "../common/Marker/CircleMarker";
import GoogleMap from "google-maps-react-markers";
import useSupercluster from "use-supercluster";
import ClusterMarker from "../common/Marker/ClusterMarker";
import {useTranslation} from "react-i18next";

const getMarkerColorId = (value: number): number => {
  if (value > 10) {
    return 2;
  } else if (value >= 4) {
    return 1;
  } else {
    return 0;
  }};

interface MapViewProps {
  data: Array<{
    site_name: string;
    latitude: number;
    longitude: number;
    "Project Count": number;
    legend: string;
    id: string | number;
  }>;
  currentView: 'General' | 'Heatmap' | 'Coverage';
  getDetails: (Id: number) => void;
  setSelectedSite: (site_id: string) => void;
  handleRedirect?: (Id: number) => void;
  setOpenSideModal?: (Id: number | null) => void;
}

interface MapOptions {
  zoom: number;
  bounds: number[];
}

interface IFeature {
  type: "Feature";
  properties: {
    cluster: boolean;
    id: number;
    item: any;
    key: number;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

const MapView: React.FC<MapViewProps> = ({ data, getDetails, setSelectedSite, handleRedirect, setOpenSideModal, currentView }) => {
  const [mapOptions, setMapOptions] = useState<MapOptions>({
    zoom: 6,
    bounds: [],
  });
  const [popupId, setPopupId] = useState<number | null>(null);
  const { i18n } = useTranslation();

  const [mapCore, setMapCore] = useState<{
    map: google.maps.Map | null;
    maps: typeof google.maps | null;
    heatmap: google.maps.visualization.HeatmapLayer | null;
    polylines: google.maps.Polyline[] | null;
  }>({
    map: null,
    maps: null,
    heatmap: null,
    polylines: null,
  });

  const points = useMemo<IFeature[]>(() => {
    return data.reduce<IFeature[]>((acc, item, key) => {
      const count = item["Project Count"];
      for (let i = 0; i < count; i++) {
        acc.push({
          type: "Feature",
          properties: {
            cluster: false,
            id: Number(`${item.id}${key}${i}`),
            item,
            key,
          },
          geometry: {
            type: "Point",
            coordinates: [item.longitude, item.latitude],
          },
        });
      }
      return acc;
    }, []);
  }, [data]);

  const { clusters } = useSupercluster({
    points,
    bounds: mapOptions.bounds,
    zoom: mapOptions.zoom,
    options: { radius: 75, maxZoom: 12 },
  });

  const handleChangeMapCoords = useCallback(
    ({ center, zoom, bounds }: {center: any; zoom: number; bounds: any}) => {
      if (center && bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        setMapOptions({
          zoom,
          bounds: [sw.lng(), sw.lat(), ne.lng(), ne.lat()],
        });
      }
    },
    []
  );

  useEffect(() => {
    if (mapCore.heatmap) {
      mapCore.heatmap.setMap(null);
    }

    if (mapCore.polylines) {
      mapCore.polylines?.forEach((polyline) => polyline?.setMap(null));
    }

    if (mapCore.map && mapCore.maps) {
      if(currentView === 'Heatmap'){
        const heatmapData = data.map((point) => ({
          location: new mapCore.maps!.LatLng(point.latitude, point.longitude),
          weight: point["Project Count"],
        }));

        const heatmap = new mapCore.maps.visualization.HeatmapLayer({
          data: heatmapData,
          radius: 40,
        });

        heatmap.setMap(mapCore.map);
        setMapCore({...mapCore, heatmap})
      }
      if(currentView === 'Coverage'){
        // const polylines = routes.map((route) => {
        //   const polyline = new mapCore.maps!.Polyline({
        //     path: route.positions,
        //     geodesic: true,
        //     strokeColor: route.color,
        //     strokeOpacity: 0.8,
        //     strokeWeight: 6,
        //   });
        //   polyline.setMap(mapCore.map);
        //   console.log(polyline, 'polyline')
        //   return polyline;
        // });
        //
        // setMapCore({ ...mapCore, polylines });


        createPolylines();


        // const directionsService = new google.maps.DirectionsService();
        //
        // const directionsDisplay = new mapCore.maps!.DirectionsRenderer();
        // directionsDisplay.setMap(mapCore.map);
        // const polylines = data.map(item => {
        //   const request = {
        //     origin:{lat: item.latitude, lng: item.longitude},
        //     destination:{lat: item.latitude, lng: item.longitude},
        //     travelMode: mapCore.maps!.DirectionsTravelMode.DRIVING
        //   };
        //   let polyline;
        //   directionsService.route(request, function(response) {
        //     if(response?.routes[0]?.overview_path){
        //       polyline = new mapCore.maps!.Polyline({
        //         path: response?.routes[0].overview_path,
        //         geodesic: true,
        //         strokeOpacity: 0.8,
        //         strokeWeight: 6,
        //         strokeColor: item["Project Count"] < 4 ? '#25c7bc' : '#FF8800'
        //       });
        //       console.log(polyline, 'polyline')
        //       polyline.setMap(mapCore.map);
        //   }})
        //   console.log(polyline, 'polyline2')
        //   return polyline;
        // })
        // setMapCore({ ...mapCore, polylines })
      }
    }
  }, [data, currentView]);

  async function createPolylines() {
    const polylines = await Promise.all(
      data.map(async (item) => {
        const request = {
          origin: { lat: item.latitude - 0.00002, lng: item.longitude - 0.00002 },
          destination: { lat: item.latitude + 0.00002, lng: item.longitude + 0.00002 },
          travelMode: google.maps.TravelMode.DRIVING,
        };

        return new Promise((resolve) => {
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(request, (response) => {
            if (response?.routes[0]?.overview_path) {
              const polyline = new mapCore.maps!.Polyline({
                path: response.routes[0].overview_path,
                geodesic: true,
                strokeOpacity: 0.8,
                strokeWeight: 6,
                strokeColor: item["Project Count"] < 4 ? '#25c7bc' : '#FF8800',
              });
              polyline.setMap(mapCore.map);
              resolve(polyline);
            } else {
              resolve(null);
            }
          });
        });
      })
    );

    setMapCore({ ...mapCore, polylines: polylines.filter(Boolean) as google.maps.Polyline[] });
  }


  // const routes = [
  //   {
  //     positions: [
  //       { lat: 24.750, lng: 46.680 },
  //       { lat: 24.760, lng: 46.700 },
  //       { lat: 24.770, lng: 46.720 },
  //       { lat: 24.780, lng: 46.740 },
  //       { lat: 24.790, lng: 46.750 },
  //     ],
  //     color: "#25c7bc",
  //   },
  //   {
  //     positions: [
  //       { lat: 24.760, lng: 46.700 },
  //       { lat: 24.770, lng: 46.710 },
  //     ],
  //     color: "#FF8800",
  //   },
  //   {
  //     positions: [
  //       { lat: 24.770, lng: 46.710 },
  //       { lat: 24.780, lng: 46.720 },
  //     ],
  //     color: "#F32641",
  //   },
  // ];

  return (
    <div className="map-view" style={{ minHeight: "600px", width: "100%" }}>
      <GoogleMap
        key={`map-${i18n.language}`}
        apiKey="AIzaSyA8muk_JkK5lt-04XqfgeSUxf3YRzJAg64"
        defaultCenter={{lat: 24.7136, lng: 46.6753}}
        defaultZoom={mapOptions.zoom}
        onChange={handleChangeMapCoords}
        libraries={["visualization"]}
        onGoogleApiLoaded={({ map, maps }) => setMapCore({ ...mapCore, map, maps })}
        options={{
          streetViewControl: true,
          mapTypeControl: true,
        }}
        externalApiParams={{language: i18n.language}}
      >
        {clusters.map((cluster, i) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount, id, item } =
            cluster.properties;

          if (isCluster) {
            return (
              <ClusterMarker
                key={i}
                lat={latitude}
                lng={longitude}
                points={pointCount}
              />
            );
          }

          return (
            <CircleMarker
              key={id}
              lat={item.latitude}
              lng={item.longitude}
              color={getMarkerColorId(item["Project Count"])}
              data={item}
              getDetails={getDetails}
              zIndex={popupId === item.id ? 4 : 2}
              setPopupId={setPopupId}
              setSelectedSite={setSelectedSite}
              handleRedirect={handleRedirect}
              setOpenSideModal={setOpenSideModal}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
};

export default MapView;
