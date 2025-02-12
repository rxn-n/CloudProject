import React from "react";
import { useNavigate } from "react-router-dom";
import {
	Ticket as TicketIcon,
	Calendar,
	MapPin,
	ChevronDown,
	Music2,
	Users,
	Star,
} from "lucide-react";

// Define types based on the DynamoDB table structure
interface Concert {
	concertId: string;
	concertName: string;
	artist: string;
	image: string;
	totalTickets: number;
	availability: string;
	venue: string;
	categories: {
		category: string;
		tickets: {
			id: string;
			status: string;
			date: string;
			venue: string;
			quantity: number;
			price: number;
		}[];
	}[];
}

interface ClientTicketViewProps {
	onBookTicket: (ticketId: string) => void;
}

// Mock function to simulate fetching data from DynamoDB
const fetchConcertDetails = async (): Promise<Concert[]> => {
	// Replace this with actual data fetched from DynamoDB via the AWS Console or other means
	const mockData: Concert[] = [
		{
			concertId: "C1",
			concertName: "Rock Festival",
			artist: "The Rockers",
			image: "https://example.com/image.jpg",
			totalTickets: 1000,
			availability: "Available",
			venue: "Main Arena",
			categories: [
				{
					category: "General Admission",
					tickets: [
						{
							id: "T1",
							status: "available",
							date: "2023-12-25T20:00:00Z",
							venue: "Main Arena",
							quantity: 100,
							price: 50,
						},
						{
							id: "T2",
							status: "sold_out",
							date: "2023-12-25T20:00:00Z",
							venue: "Main Arena",
							quantity: 0,
							price: 75,
						},
					],
				},
				{
					category: "VIP",
					tickets: [
						{
							id: "T3",
							status: "available",
							date: "2023-12-25T20:00:00Z",
							venue: "Main Arena",
							quantity: 20,
							price: 150,
						},
					],
				},
			],
		},
		{
			concertId: "C2",
			concertName: "Jazz Night",
			artist: "The Jazz Trio",
			image: "https://example.com/jazz.jpg",
			totalTickets: 500,
			availability: "Limited Seating",
			venue: "Small Hall",
			categories: [
				{
					category: "General Admission",
					tickets: [
						{
							id: "T4",
							status: "available",
							date: "2023-12-30T19:00:00Z",
							venue: "Small Hall",
							quantity: 200,
							price: 40,
						},
					],
				},
			],
		},
	];

	return mockData;
};

export function ClientTicketView({ onBookTicket }: ClientTicketViewProps) {
	const navigate = useNavigate();
	const [expandedConcerts, setExpandedConcerts] = React.useState<Set<string>>(
		new Set()
	);
	const [hoveredTicket, setHoveredTicket] = React.useState<string | null>(null);
	const [concerts, setConcerts] = React.useState<Concert[]>([]);

	React.useEffect(() => {
		// Fetch concert details when the component mounts
		fetchConcertDetails().then((data) => {
			setConcerts(data);
		});
	}, []);

	const toggleConcert = (name: string) => {
		setExpandedConcerts((prev) => {
			const next = new Set(prev);
			if (next.has(name)) {
				next.delete(name);
			} else {
				next.add(name);
			}
			return next;
		});
	};

	// Helper function to calculate remaining tickets per category
	const getRemainingTickets = (
		tickets: { status: string; quantity: number }[]
	) => {
		return tickets
			.filter((t) => t.status === "available")
			.reduce((acc, t) => acc + t.quantity, 0);
	};

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
				{concerts.map((concert) => {
					const firstTicket = concert.categories[0]?.tickets[0];
					const totalAvailable = concert.categories.reduce(
						(acc, cat) => acc + getRemainingTickets(cat.tickets),
						0
					);

					return (
						<div
							key={concert.concertId}
							className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl
                ${
									expandedConcerts.has(concert.concertName)
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
											{totalAvailable} tickets available
										</span>
										<span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
											Status: {concert.availability}
										</span>
										<button
											onClick={() => toggleConcert(concert.concertName)}
											className="px-4 py-1 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700
                        transform hover:scale-105 transition-all duration-300"
										>
											View Details
										</button>
									</div>
								</div>
							</div>

							<div
								className={`transition-all duration-500 ease-in-out
                  ${
										expandedConcerts.has(concert.concertName)
											? "max-h-[2000px] opacity-100"
											: "max-h-0 opacity-0 overflow-hidden"
									}`}
							>
								<div className="border-t border-gray-100">
									{concert.categories.map((category) => {
										const remainingTickets = getRemainingTickets(
											category.tickets
										);
										if (remainingTickets === 0) return null;

										return (
											<div
												key={category.category}
												className="p-6 border-b border-gray-100 last:border-b-0"
											>
												<div className="flex items-center gap-2 mb-6">
													<TicketIcon className="w-5 h-5 text-indigo-600" />
													<h3 className="text-xl font-semibold text-gray-900">
														Category {category.category} ({remainingTickets}{" "}
														tickets remaining)
													</h3>
												</div>
												<div className="space-y-4">
													{category.tickets
														.filter((t) => t.status === "available")
														.map((ticket) => (
															<div
																key={ticket.id}
																className={`relative bg-gray-50 rounded-xl p-6 transform transition-all duration-300
                                  ${
																		hoveredTicket === ticket.id
																			? "scale-[1.02] shadow-md bg-gray-100"
																			: "hover:shadow-sm"
																	}`}
																onMouseEnter={() => setHoveredTicket(ticket.id)}
																onMouseLeave={() => setHoveredTicket(null)}
															>
																<div className="flex items-center justify-between">
																	<div className="space-y-3">
																		<div className="flex items-center gap-4">
																			<div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-1.5 rounded-full">
																				<Calendar className="w-4 h-4" />
																				<span>
																					{new Date(
																						ticket.date
																					).toLocaleDateString("en-US", {
																						weekday: "short",
																						month: "short",
																						day: "numeric",
																						year: "numeric",
																					})}
																				</span>
																			</div>
																			<div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-1.5 rounded-full">
																				<MapPin className="w-4 h-4" />
																				<span>{ticket.venue}</span>
																			</div>
																			<div className="flex items-center gap-2 text-gray-600 bg-white px-3 py-1.5 rounded-full">
																				<Users className="w-4 h-4" />
																				<span>
																					{ticket.quantity} tickets left
																				</span>
																			</div>
																		</div>
																		<div className="text-2xl font-bold text-gray-900">
																			${ticket.price.toFixed(2)}
																		</div>
																	</div>
																	<button
																		onClick={() =>
																			navigate("/booking", {
																				state: { ticket },
																			})
																		}
																		className={`relative group bg-indigo-600 text-white px-8 py-3 rounded-xl
                                      font-semibold transition-all duration-300 hover:bg-indigo-700
                                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                      transform hover:translate-y-[-2px] active:translate-y-[0px]`}
																	>
																		<span className="relative z-10">
																			Book Now
																		</span>
																		<div
																			className="absolute inset-0 h-full w-full bg-white rounded-xl 
                                      transform scale-x-0 group-hover:scale-x-100 origin-left 
                                      transition-transform duration-300 opacity-10"
																		></div>
																	</button>
																</div>
															</div>
														))}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
