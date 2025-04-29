
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  clubName: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

const EventCard = ({
  id,
  title,
  description,
  clubName,
  date,
  time,
  location,
  imageUrl,
}: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col animate-fade-in">
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-sm text-white bg-clubhub-blue rounded-full">
            {clubName}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        
        <div className="space-y-2 mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{date}</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{time}</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location}</span>
          </div>
        </div>
        
        <Link to={`/events/${id}`}>
          <Button className="w-full bg-clubhub-blue hover:bg-clubhub-blue-light">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
