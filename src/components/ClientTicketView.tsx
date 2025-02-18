import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket as TicketIcon,
  Calendar,
  MapPin,
  Music2,
  Users,
  Star,
} from "lucide-react";

interface Concert {
  concertId: string;
  concertName: string;
  concertDate: string;
  artist: string;
  image: string;
  totalTickets: number;
  availability: string;
  venue: string;
}

interface TicketCategory {
  category: string;
  concertId: string;
  price: number;
  status: string;
}

export function ClientTicketView() {
  const navigate = useNavigate();
  const [concerts, setConcerts] = React.useState<Concert[]>([]);
  const [ticketCategories, setTicketCategories] = React.useState<
    TicketCategory[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedConcerts, setExpandedConcerts] = React.useState<Set<string>>(
    new Set()
  );

  // Fetch concert details
  React.useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch(
          "https://3t4o14o7s6.execute-api.us-east-1.amazonaws.com/default/getConcertDetailsLambda"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch concert data");
        }
        const data: Concert[] = await response.json();
        setConcerts(data);
      } catch (err) {
        setError("Error fetching concert details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  // Fetch ticket categories for each concert
  const fetchTicketCategories = async (concertId: string) => {
    try {
      const response = await fetch(
        `https://mzc9mihhb6.execute-api.us-east-1.amazonaws.com/default/getTicketDetailsLambda`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch ticket categories");
      }
      const data: TicketCategory[] = await response.json();
      setTicketCategories((prev) => [
        ...prev.filter((ticket) => ticket.concertId !== concertId), // Remove old data for the same concertId
        ...data.filter((ticket) => ticket.concertId === concertId),
      ]);
    } catch (err) {
      setError("Error fetching ticket categories.");
      console.error(err);
    }
  };

  const toggleConcert = (concertId: string) => {
    setExpandedConcerts((prev) => {
      const next = new Set(prev);
      if (next.has(concertId)) {
        next.delete(concertId);
      } else {
        next.add(concertId);
        fetchTicketCategories(concertId); // Fetch ticket categories when expanding
      }
      return next;
    });
  };

  const handleBuyTickets = (concertId: string) => {
    // Navigate to the QueueLanding page and pass the concertId as state
    navigate("/queue", { state: { concertId } });
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading concerts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Music2 className="w-10 h-10 text-indigo-600" />
          Upcoming Concerts
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Book your tickets for the most anticipated concerts. Secure your spot
          and create unforgettable memories.
        </p>
      </div>

      <div className="space-y-8">
        {concerts.map((concert) => (
          <div
            key={concert.concertId}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
              expandedConcerts.has(concert.concertId)
                ? "ring-2 ring-indigo-500"
                : ""
            }`}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={concert.image}
                alt={concert.concertName}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">Featured Artist</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">{concert.artist}</h2>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    {concert.concertDate}
                  </span>
                  <button
                    onClick={() => toggleConcert(concert.concertId)}
                    className="px-4 py-1 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300"
                  >
                    View Details
                  </button>
                  {concert.availability !== "Sold Out" && (
                    <button
                      onClick={() => handleBuyTickets(concert.concertId)}
                      className="px-4 py-1 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ml-auto flex"
                    >
                      Buy Tickets
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                expandedConcerts.has(concert.concertId)
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="border-t border-gray-100">
                {/* Display ticket categories */}
                <div className="p-6 text-gray-600">
                  <h3 className="text-xl font-semibold mb-2">Ticket Categories</h3>
                  {ticketCategories
                    .filter((ticket) => ticket.concertId === concert.concertId)
                    .map((ticket) => (
                      <div key={ticket.category} className="mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">
                            {ticket.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {ticket.status}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span>Price: ${ticket.price}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}