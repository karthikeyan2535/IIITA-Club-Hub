
import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
}

const SectionHeader = ({ title, viewAllLink }: SectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-clubhub-gray-dark">{title}</h2>
      {viewAllLink && (
        <Link to={viewAllLink} className="text-clubhub-blue hover:text-clubhub-blue-light flex items-center">
          View All 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
