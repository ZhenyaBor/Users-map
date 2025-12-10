import { useDeferredValue, useMemo, useTransition } from 'react';
import { type LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useUsers } from '../../hooks/useUsers';
import UsersLayer from '../UsersLayer/UsersLayer';
import './index.css';

type UsersMapProps = {
  interestFilter: string;
};

const DEFAULT_CENTER: LatLngTuple = [20, 0];

const UsersMap = ({ interestFilter }: UsersMapProps) => {
  const { users, loading, error } = useUsers();
  const deferredFilter = useDeferredValue(interestFilter);
  const [isPending] = useTransition();

  const filteredUsers = useMemo(() => {
    const needle = deferredFilter.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((user) => user.interestsLc.some((item) => item.includes(needle)));
  }, [deferredFilter, users]);

  const filteredWithTransition = useMemo(() => filteredUsers, [filteredUsers]);

  const statusText = useMemo(() => {
    if (loading) return 'Завантажуємо користувачів по всьому світу...';
    if (error) return `Помилка: ${error}`;
    if (!users.length) return 'У джерелі немає користувачів';
    if (!filteredUsers.length) return 'Нічого не знайдено за цим інтересом';
    if (interestFilter) {
      return `Знайдено ${filteredUsers.length} з ${users.length} користувачів`;
    }
    return `Відображаємо ${users.length} користувачів`;
  }, [loading, error, users.length, filteredUsers.length, interestFilter]);

  return (
    <div className='map-wrapper'>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={2}
        minZoom={2}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {!loading && !error && filteredWithTransition.length > 0 && (
          <UsersLayer users={filteredWithTransition} />
        )}
      </MapContainer>

      <div className='map-status'>
        <strong>Статус</strong>
        <span>{isPending ? 'Оновлюємо відображення…' : statusText}</span>
      </div>
    </div>
  );
};

export default UsersMap;
