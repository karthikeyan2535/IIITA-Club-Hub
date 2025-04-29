import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Home, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { useClubs } from "@/hooks/useClubs";
import { useClubEvents, useDeleteEvent } from "@/hooks/useEventManagement"; 
import { useClubAnnouncements } from "@/hooks/useAnnouncements";
import { useClubMembers, useRemoveMember } from "@/hooks/useClubMembers";
import CreateEventForm from "@/components/clubs/CreateEventForm";
import CreateAnnouncementForm from "@/components/clubs/CreateAnnouncementForm";
import EditEventForm from "@/components/events/EditEventForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OrganizerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedClubId, setSelectedClubId] = useState<string>("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (
      user.user_metadata &&
      user.user_metadata.role &&
      user.user_metadata.role !== "organizer"
    ) {
      navigate("/");
    }
  }, [user, navigate]);

  const { data: clubs = [], isLoading: loadingClubs } = useClubs();
  const { data: events = [], isLoading: loadingEvents } = useClubEvents(selectedClubId);
  const { data: announcements = [], isLoading: loadingAnnouncements } = useClubAnnouncements(selectedClubId);
  const { data: clubMembers = [], isLoading: loadingMembers } = useClubMembers(selectedClubId);
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutate: removeMember } = useRemoveMember();

  // Fetch event registrations when a club is selected
  useEffect(() => {
    const fetchEventRegistrations = async () => {
      if (!selectedClubId) return;
      
      setLoadingRegistrations(true);
      try {
        // First get all events for the selected club
        const { data: clubEvents } = await supabase
          .from('events')
          .select('id, title')
          .eq('club_id', selectedClubId);

        if (!clubEvents?.length) {
          setEventRegistrations([]);
          return;
        }

        const eventIds = clubEvents.map(event => event.id);

        // Then get all registrations for these events
        const { data: registrations, error } = await supabase
          .from('event_participants')
          .select('*')
          .in('event_id', eventIds);

        if (error) throw error;

        // Combine event details with registrations
        const registrationsWithEventDetails = registrations?.map(registration => ({
          ...registration,
          eventTitle: clubEvents.find(event => event.id === registration.event_id)?.title
        }));

        setEventRegistrations(registrationsWithEventDetails || []);
      } catch (error) {
        console.error('Error fetching event registrations:', error);
        toast.error('Failed to load event registrations');
      } finally {
        setLoadingRegistrations(false);
      }
    };

    fetchEventRegistrations();
  }, [selectedClubId]);

  const handleDeleteEvent = (eventId: string, clubId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent({ eventId, clubId });
    }
  };

  const handleUnregisterParticipant = async (registrationId: string) => {
    if (!window.confirm("Are you sure you want to unregister this participant?")) return;

    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', registrationId);

      if (error) throw error;

      setEventRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
      toast.success('Participant unregistered successfully');
    } catch (error) {
      console.error('Error unregistering participant:', error);
      toast.error('Failed to unregister participant');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-clubhub-blue">Organizer Dashboard</h1>
      </div>
      
      <Tabs defaultValue="clubs" className="w-full">
        <TabsList className="mb-6 flex flex-wrap gap-2 bg-soft-purple">
          <TabsTrigger value="clubs">Manage Clubs</TabsTrigger>
          <TabsTrigger value="events">Manage Events</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="registrations">Event Registrations</TabsTrigger>
          <TabsTrigger value="profile">Profile & Settings</TabsTrigger>
        </TabsList>
        
        {/* Existing tabs content remains the same */}
        <TabsContent value="clubs">
          {/* Existing clubs content */}
          {clubs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium mb-2">No clubs exist yet</h3>
                  <p className="text-gray-500 mb-4">Create a club to get started</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clubs.map((club: any) => (
                <Card 
                  key={club.id} 
                  className={cn(
                    "transition-all duration-300", 
                    selectedClubId === club.id 
                      ? "border-vivid-purple border-2 bg-soft-purple/10" 
                      : "border-gray-200"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        {club.image_url && (
                          <img 
                            src={club.image_url} 
                            alt={club.name} 
                            className="w-10 h-10 rounded-full mr-2 object-cover" 
                          />
                        )}
                        {club.name}
                      </div>
                      {club.organizer_id === user?.id && (
                        <Badge variant="outline">Owner</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600">{club.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>Members: {club.member_count || 0}</span>
                      <span>Events: {club.event_count || 0}</span>
                    </div>
                    <Button 
                      className={cn(
                        "w-full", 
                        selectedClubId === club.id 
                          ? "bg-vivid-purple text-white" 
                          : ""
                      )}
                      onClick={() => {
                        setSelectedClubId(club.id);
                        document.querySelector('[value="events"]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        );
                      }}
                    >
                      Manage Club
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Other existing tab contents remain the same */}
        <TabsContent value="events">
        {!selectedClubId ? (
            <Card>
              <CardContent className="pt-6 text-center p-6">
                <p>Please select a club to manage events</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Events</h2>
                <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Event</DialogTitle>
                    </DialogHeader>
                    <CreateEventForm 
                      clubId={selectedClubId} 
                      clubName={clubs.find((c: any) => c.id === selectedClubId)?.name || ""}
                      onSuccess={() => setShowEventForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              {loadingEvents ? (
                <p>Loading events...</p>
              ) : events.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center p-6">
                      <h3 className="text-lg font-medium mb-2">No events yet</h3>
                      <p className="text-gray-500 mb-4">Create your first event for this club</p>
                      <Button onClick={() => setShowEventForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {events.map((event: any) => (
                    <Card key={event.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          {event.image_url && (
                            <img 
                              src={event.image_url} 
                              alt={event.title} 
                              className="w-16 h-16 object-cover rounded" 
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-sm text-gray-500">
                              {event.date} | {event.time} | {event.location}
                            </p>
                            <p className="text-sm text-gray-500">
                              Participants: {event.registered_participants || 0}
                              {event.max_participants && ` / ${event.max_participants}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Event</DialogTitle>
                                </DialogHeader>
                                <EditEventForm 
                                  event={event} 
                                  onSuccess={() => setShowEventForm(false)}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => handleDeleteEvent(event.id, selectedClubId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="announcements">
        {!selectedClubId ? (
            <Card>
              <CardContent className="pt-6 text-center p-6">
                <p>Please select a club to manage announcements</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Announcements</h2>
                <Dialog open={showAnnouncementForm} onOpenChange={setShowAnnouncementForm}>
                  <DialogTrigger asChild>
                    <Button>Create Announcement</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Announcement</DialogTitle>
                    </DialogHeader>
                    <CreateAnnouncementForm
                      clubId={selectedClubId}
                      onSuccess={() => setShowAnnouncementForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              {loadingAnnouncements ? (
                <p>Loading announcements...</p>
              ) : announcements.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center p-6">
                      <h3 className="text-lg font-medium mb-2">No announcements yet</h3>
                      <p className="text-gray-500 mb-4">Create your first announcement for this club</p>
                      <Button onClick={() => setShowAnnouncementForm(true)}>
                        Create Announcement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement: any) => (
                    <Card key={announcement.id}>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Posted on {new Date(announcement.created_at).toLocaleDateString()}
                        </p>
                        <p>{announcement.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="members">
        {!selectedClubId ? (
            <Card>
              <CardContent className="pt-6 text-center p-6">
                <p>Please select a club to view members</p>
              </CardContent>
            </Card>
          ) : loadingMembers ? (
            <p>Loading members...</p>
          ) : clubMembers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center p-6">
                <h3 className="text-lg font-medium mb-2">No members found</h3>
                <p className="text-gray-500 mb-4">Invite members to join your club</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  Members ({clubMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 pr-3">Name</th>
                      <th className="py-2 pr-3">Email</th>
                      <th className="py-2 pr-3">Role</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubMembers.map((member: any) => (
                      <tr key={member.id} className="border-b">
                        <td className="py-2 pr-3">{member.name}</td>
                        <td className="py-2 pr-3">{member.email}</td>
                        <td className="py-2 pr-3 capitalize">{member.role}</td>
                        <td className="py-2">
                          {user?.id !== member.user_id && (
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                if (window.confirm(`Remove ${member.name} from this club?`)) {
                                  removeMember({ clubId: selectedClubId, userId: member.user_id });
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* New Event Registrations tab */}
        <TabsContent value="registrations">
          {!selectedClubId ? (
            <Card>
              <CardContent className="pt-6 text-center p-6">
                <p>Please select a club to view event registrations</p>
              </CardContent>
            </Card>
          ) : loadingRegistrations ? (
            <Card>
              <CardContent className="pt-6 text-center p-6">
                <p>Loading registrations...</p>
              </CardContent>
            </Card>
          ) : eventRegistrations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center p-6">
                <h3 className="text-lg font-medium mb-2">No event registrations found</h3>
                <p className="text-gray-500">There are no registrations for any events in this club</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Event Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Event</th>
                        <th className="text-left py-3 px-4">Participant</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Registration Date</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventRegistrations.map((registration) => (
                        <tr key={registration.id} className="border-b">
                          <td className="py-3 px-4">{registration.eventTitle}</td>
                          <td className="py-3 px-4">{registration.name}</td>
                          <td className="py-3 px-4">{registration.email}</td>
                          <td className="py-3 px-4">
                            {new Date(registration.registered_at).toLocaleDateString()}
                          </td>
                        
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleUnregisterParticipant(registration.id)}
                            >
                              Unregister
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="profile">
        <div className="bg-white rounded p-5 min-h-[180px]">
            <h2 className="text-xl font-semibold mb-3">Profile & Settings</h2>
            <div className="flex flex-col gap-4 max-w-md">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <Input value={user?.user_metadata?.name || ""} disabled />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <Input type="email" value={user?.email || ""} disabled />
              </div>
              <div>
                <label className="block text-sm mb-1">Role</label>
                <Input value={user?.user_metadata?.role || "organizer"} disabled />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizerDashboardPage;