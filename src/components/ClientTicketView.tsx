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
	artist: string;
	image: string;
	totalTickets: number;
	availability: string;
	venue: string;
}

interface ClientTicketViewProps {
	onBookTicket: (ticketId: string) => void;
}

export function ClientTicketView({ onBookTicket }: ClientTicketViewProps) {
	const navigate = useNavigate();
	const [concerts, setConcerts] = React.useState<Concert[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string | null>(null);

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
						className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
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
									{/* <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
										{concert.totalTickets} total tickets
									</span> */}
									<span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
										Status: {concert.availability}
									</span>
									<button
										onClick={() => navigate(`/concert/${concert.concertId}`)}
										className="px-4 py-1 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300"
									>
										View Details
									</button>
									{concert.availability !== "Sold Out" && (
										<button
											onClick={() =>
												navigate(`/purchase-ticket/${concert.concertId}`)
											}
											className="px-4 py-1 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 
               transform hover:scale-105 transition-all duration-300 ml-auto flex"
										>
											Buy Tickets
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
