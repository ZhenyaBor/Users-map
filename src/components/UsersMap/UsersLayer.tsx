import { memo, type FC } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { type UserRecord } from '../../types/user';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

type UsersLayerProps = {
  users: UserRecord[];
};

const UsersLayer: FC<UsersLayerProps> = memo(({ users }) => {
  const defaultIcon = L.icon({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41],
    shadowAnchor: [12, 41],
    popupAnchor: [1, -34],
    iconSize: [25, 41],
    shadowSize: [41, 41],
  });

  if (!users.length) return null;

  return (
    <MarkerClusterGroup
      chunkedLoading
      chunkInterval={200}
      chunkDelay={25}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom
      maxClusterRadius={80}>
      {users.map((user) => (
        <Marker key={user.id} position={[user.lat, user.lon]} icon={defaultIcon}>
          <Popup>
            <strong>{user.name}</strong>
            <br />
            Інтереси: {user.interests.join(', ') || '—'}
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
});

export default UsersLayer;
