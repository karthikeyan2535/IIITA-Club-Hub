
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, AlertCircle } from "lucide-react";
import { isValidUUID } from "@/hooks/useClubs";
import { useToast } from "@/hooks/use-toast";

interface ClubCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  eventCount: number;
  imageUrl: string;
}

const ClubCard = ({
  id,
  name,
  description,
  category,
  memberCount,
  eventCount,
  imageUrl
}: ClubCardProps) => {
  const { toast } = useToast();
  
  // Validate UUID format before rendering
  const isValidId = isValidUUID(id);
  
  if (!isValidId) {
    console.warn(`Club card has invalid UUID: ${id}. This will cause errors when joining/leaving.`);
  }
  
  // Create a Link or div depending on if the ID is valid
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isValidId) {
      return <Link to={`/clubs/${id}`} className="block transition-transform hover:scale-[1.02]">{children}</Link>;
    }
    return (
      <div 
        className="block transition-transform hover:scale-[1.02] cursor-not-allowed opacity-90"
        onClick={() => {
          toast({
            title: "Invalid Club ID",
            description: `This club (${name}) has an invalid ID format: "${id}". Expected UUID format.`,
            variant: "destructive"
          });
        }}
      >
        {children}
      </div>
    );
  };
  
  return (
    <CardWrapper>
      <Card className={`h-full overflow-hidden hover:shadow-md transition-shadow ${!isValidId ? 'border-red-300' : ''}`}>
        <div className="h-48 overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={name} 
            className={`w-full h-full object-cover transition-transform hover:scale-105 ${!isValidId ? 'opacity-80' : ''}`}
          />
          {!isValidId && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Invalid ID
              </Badge>
            </div>
          )}
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{name}</CardTitle>
            <Badge>{category}</Badge>
          </div>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{memberCount} Members</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{eventCount} Events</span>
            </div>
          </div>
          {!isValidId && (
            <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Invalid UUID format: {id.substring(0, 10)}...
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export default ClubCard;
