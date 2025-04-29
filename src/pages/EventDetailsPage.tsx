
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRegisterEvent, useUnregisterEvent, useMyEventRegistrations } from "@/hooks/useEventRegistration";
import { toast as sonnerToast } from "sonner";

import {
  Calendar,
  MapPin,
  Users,
  Bookmark,
  Share,
  Edit,
  Trash,
  Check,
  X
} from "lucide-react";

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("details");
  
  // Fetch event details
  const { data: event, isLoading: loadingEvent } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) throw new Error("Event ID is missing");
      
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!eventId
  });
  
  // Fetch event participants (for organizers)
  const { data: participants = [], isLoading: loadingParticipants } = useQuery({
    queryKey: ["eventParticipants", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", eventId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId && !!user && (user.user_metadata?.role === "organizer" || user.user_metadata?.role === "admin")
  });

  // Check if user is registered for this event
  const { data: registrations = [] } = useMyEventRegistrations();
  const isRegistered = registrations.includes(eventId || "");
  
  // Register for event mutation
  const { mutate: registerForEvent, isPending: registerPending } = useRegisterEvent();
  
  // Unregister from event mutation
  const { mutate: unregisterFromEvent, isPending: unregisterPending } = useUnregisterEvent();
  
  // Check if user is an organizer of the club that owns this event
  const [isOrganizer, setIsOrganizer] = useState(false);
  
  useEffect(() => {
    const checkOrganizerStatus = async () => {
      if (!user || !event?.club_id) return;

      try {
        const { data, error } = await supabase
          .from("club_members")
          .select("role")
          .eq("user_id", user.id)
          .eq("club_id", event.club_id)
          .single();
        
        if (!error && data) {
          setIsOrganizer(["organizer", "lead"].includes(data.role));
        }
      } catch (error) {
        console.error("Error checking organizer status:", error);
      }
    };
    
    checkOrganizerStatus();
  }, [user, event]);
  
  // Handle event registration
  const handleRegister = () => {
    if (!user || !eventId) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for this event",
        variant: "destructive",
      });
      return;
    }
    
    registerForEvent({
      eventId: eventId,
      name: user.user_metadata?.name || "",
      email: user.email || "",
    }, {
      onSuccess: () => {
        sonnerToast.success("Successfully registered for event");
      },
      onError: (err: Error) => {
        sonnerToast.error(`Failed to register: ${err.message}`);
      }
    });
  };
  
  // Handle event unregistration
  const handleUnregister = () => {
    if (!eventId) return;
    
    unregisterFromEvent(eventId, {
      onSuccess: () => {
        sonnerToast.success("Successfully unregistered from event");
      },
      onError: (err: Error) => {
        sonnerToast.error(`Failed to unregister: ${err.message}`);
      }
    });
  };
  
  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!eventId || !confirm("Are you sure you want to delete this event?")) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);
      
      if (error) throw error;
      
      sonnerToast.success("Event deleted successfully");
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
      sonnerToast.error("Failed to delete event");
    }
  };
  
  // Mark attendance
  const handleMarkAttendance = async (participantId: string, status: boolean) => {
    try {
      const { error } = await supabase
        .from("event_participants")
        .update({ attendance: status })
        .eq("id", participantId);
      
      if (error) throw error;
      
      sonnerToast.success("Attendance updated");
      // Refresh participants data
      window.location.reload();
    } catch (error) {
      console.error("Error marking attendance:", error);
      sonnerToast.error("Failed to update attendance");
    }
  };
  
  if (loadingEvent) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-xl">Loading event information...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <h1 className="text-2xl font-bold mb-4">Event not found</h1>
            <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link to="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  const registrationsAvailable = event.max_participants 
    ? event.max_participants > (event.registered_participants || 0)
    : true;
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Event header section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/3">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src={event.image_url || "/placeholder.svg"} 
                alt={event.title} 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/clubs/${event.club_id}`} className="text-clubhub-blue hover:underline">
                  {event.club_name}
                </Link>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar size={14} /> {event.date}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar size={14} /> {event.time}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin size={14} /> {event.location}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                {isOrganizer && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDeleteEvent}
                    >
                      <Trash className="mr-1" size={18} />
                      Delete
                    </Button>
                  </>
                )}
                
                {user && !isOrganizer && (
                  <>
                    {isRegistered ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleUnregister}
                        disabled={unregisterPending}
                      >
                        <X className="mr-1" size={18} />
                        Cancel Registration
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleRegister}
                        disabled={registerPending || !registrationsAvailable}
                      >
                        <Check className="mr-1" size={18} />
                        Register
                      </Button>
                    )}
                  </>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.share?.({
                      title: event.title,
                      text: event.description,
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied",
                        description: "Event link copied to clipboard"
                      });
                    });
                  }}
                >
                  <Share className="mr-1" size={18} />
                  Share
                </Button>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{event.description}</p>
            
            <div className="flex items-center text-gray-600">
              <Users className="mr-2" size={18} />
              <span>
                {event.registered_participants || 0} 
                {event.max_participants 
                  ? ` / ${event.max_participants} registered`
                  : " registered"}
              </span>
              
              {!registrationsAvailable && (
                <Badge variant="secondary" className="ml-2">Fully Booked</Badge>
              )}
              
              {isRegistered && (
                <Badge className="ml-2 bg-green-500">You are registered</Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Event content tabs */}
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            {(isOrganizer) && (
              <TabsTrigger value="participants">Participants</TabsTrigger>
            )}
            {event.results && (
              <TabsTrigger value="results">Results</TabsTrigger>
            )}
          </TabsList>
          
          {/* Details tab */}
          <TabsContent value="details" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Everything you need to know about this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    {event.eligibility && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
                        <p>{event.eligibility}</p>
                      </div>
                    )}
                    
                    {event.rules && event.rules.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Rules</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {event.rules.map((rule: string, index: number) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Date & Time</h3>
                      <p>{event.date}, {event.time}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Venue</h3>
                      <p>{event.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Participants tab (organizers only) */}
          {isOrganizer && (
            <TabsContent value="participants" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Participants</CardTitle>
                  <CardDescription>
                    {event.registered_participants || 0} 
                    {event.max_participants 
                      ? ` / ${event.max_participants} registered`
                      : " participants registered"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingParticipants ? (
                    <div className="text-center py-8">Loading participants...</div>
                  ) : participants.length === 0 ? (
                    <div className="text-center py-8">No participants registered yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Name</th>
                            <th className="text-left py-3 px-4">Email</th>
                            <th className="text-left py-3 px-4">Registration Date</th>
                            <th className="text-left py-3 px-4">Attendance</th>
                            <th className="text-right py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((participant: any) => (
                            <tr key={participant.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">{participant.name}</td>
                              <td className="py-3 px-4">{participant.email}</td>
                              <td className="py-3 px-4">{new Date(participant.registered_at).toLocaleDateString()}</td>
                              <td className="py-3 px-4">
                                {participant.attendance === true ? (
                                  <Badge className="bg-green-500">Present</Badge>
                                ) : participant.attendance === false ? (
                                  <Badge variant="outline">Absent</Badge>
                                ) : (
                                  <Badge variant="outline">Not Marked</Badge>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-green-500 text-green-500 hover:bg-green-50"
                                    onClick={() => handleMarkAttendance(participant.id, true)}
                                  >
                                    Present
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-red-500 text-red-500 hover:bg-red-50"
                                    onClick={() => handleMarkAttendance(participant.id, false)}
                                  >
                                    Absent
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {/* Results tab (if available) */}
          {event.results && (
            <TabsContent value="results" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Event Results</CardTitle>
                  <CardDescription>Outcomes and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Results</h3>
                    <p>{event.results}</p>
                  </div>
                  
                  {event.highlights && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Highlights</h3>
                      <p>{event.highlights}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
