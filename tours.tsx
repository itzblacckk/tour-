'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Price {
  title: string;
  price: number;
  capacity: number;
  _id: string;
}

interface Image {
  link: string;
  type: string;
  _id: string;
}

interface Trip {
  _id: string;
  title: string;
  isActive: boolean;
  prices: Price[];
  images: Image[];
  tripLabel: string;
  slug: string;
  display_price: string;
}

interface Category {
  _id: string;
  name: string;
  metaKeywords: string[];
  hideCalender: boolean;
}

interface ApiResponse {
  category: Category;
  trips: Trip[];
}

export default function TripList() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('https://api.trekpanda.in/api/getTripsByCategoryIdNew/pune-weekend-treks');
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data: ApiResponse = await response.json();
        setTrips(data.trips);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleTripClick = (slug: string) => {
    router.push(`/trip-details/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary">Pune Weekend Treks</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => {
          const homeScreenImage = trip.images?.find(img => img.type === 'Home Screen')?.link;

          return (
            <div
              key={trip._id}
              className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleTripClick(trip.slug)}
            >
              <div className="relative h-48 overflow-hidden">
                {homeScreenImage && (
                  <img
                    src={homeScreenImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {trip.tripLabel === 'groupTrip' ? 'Group Trip' : 'Private Trip'}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h2 className="text-xl font-semibold text-card-foreground line-clamp-2">
                  {trip.title}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">1N/1D</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="text-lg font-bold text-primary">₹{trip.display_price}/-</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
