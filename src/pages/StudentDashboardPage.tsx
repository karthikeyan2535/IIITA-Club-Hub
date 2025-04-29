import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClubs, useJoinClub, useLeaveClub, useFollowClub, useUnfollowClub } from "@/hooks/useClubs";
import { useMyClubs } from "@/hooks/useMyClubs";
import { useClubEvents } from "@/hooks/useClubEvents";
import { useMyEventRegistrations, useRegisterEvent, useUnregisterEvent } from "@/hooks/useEventRegistration";
import { useStudentProfile, useUpdateProfile } from "@/hooks/useStudentProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useStudentEvents } from "@/hooks/useEventManagement";
import { Home } from "lucide-react";

const categories = [
  "All", "Cultural", "Technical", "Academic", "Sports", "Arts"
];

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (
      user.user_metadata &&
      user.user_metadata.role &&
      user.user_metadata.role !== "student"
    ) {
      navigate("/");
    }
  }, [user, navigate]);

  const { data: clubs = [], isLoading: loadingClubs, error: errorClubs } = useClubs();
  const { data: myClubs = [], isLoading: loadingMyClubs } = useMyClubs();
  const { mutate: joinClub, isPending: joiningClub } = useJoinClub();
  const { mutate: leaveClub, isPending: leavingClub } = useLeaveClub();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");

  const { data: events = [], isLoading: loadingEvents } = useClubEvents();
  const { data: registrations = [] } = useMyEventRegistrations();
  const { mutate: registerForEvent, isPending: regPending } = useRegisterEvent();
  const { mutate: unregisterFromEvent, isPending: unregPending } = useUnregisterEvent();
  const { data: registeredEvents = [], isLoading: loadingRegisteredEvents } = useStudentEvents();

  const { data: profile, isLoading: loadingProfile } = useStudentProfile();
  const { mutate: updateProfile, isPending: updatingProfile } = useUpdateProfile();

  const filteredClubs = clubs.filter(
    (club: any) =>
      (selectedCategory === "All" || club.category === selectedCategory) &&
      club.name.toLowerCase().includes(search.toLowerCase())
  );

  const joinedClubIds = myClubs.map((c: any) => c.id);

  const registeredEventIds = registrations;

  useEffect(() => {
    setProfileName(profile?.name || "");
  }, [profile]);

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
        <h1 className="text-3xl font-bold text-clubhub-blue">Student Dashboard</h1>
      </div>

      <Tabs defaultValue="myclubs" className="w-full">
        <TabsList className="mb-6 flex flex-wrap gap-2 bg-soft-gray">
          <TabsTrigger value="myclubs">My Clubs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="registered">Registered Events</TabsTrigger>
          <TabsTrigger value="profile">Profile & Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="myclubs">
          <div>
            <h2 className="text-xl font-semibold mb-3">My Clubs</h2>
            {loadingMyClubs ? (
              <div className="text-center text-gray-400 py-20">Loading clubs...</div>
            ) : myClubs.length === 0 ? (
              <div className="text-center text-gray-400 py-20">Not a member of any club yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {myClubs.map((club: any) => (
                  <div key={club.id} className="flex items-center gap-3 p-3 border rounded bg-white">
                    <img src={club.image_url || "/placeholder.svg"} className="w-10 h-10 rounded-full object-cover" />
                    <span>{club.name}</span>
                    <Button
                      className="ml-auto"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/clubs/${club.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      className="bg-red-500 text-white rounded hover:bg-red-600"
                      size="sm"
                      disabled={leavingClub}
                      onClick={() => leaveClub(club.id, {
                        onSuccess: () => toast.success("Left club"),
                        onError: err => toast.error(err.message),
                      })}
                    >
                      Leave
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div>
            <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
            {loadingEvents ? (
              <div className="text-center text-gray-400 py-20">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="text-center text-gray-400 py-20">No upcoming events in your clubs.</div>
            ) : (
              events.map((event: any) => {
                const registered = registeredEventIds.includes(event.id);
                const full = typeof event.max_participants === "number" && typeof event.registered_participants === "number"
                  ? event.registered_participants >= event.max_participants
                  : false;
                return (
                  <div key={event.id} className="border rounded p-4 bg-white flex items-center gap-3 mb-3">
                    <img src={event.image_url || "/placeholder.svg"} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.date} · {event.location}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      View
                    </Button>
                    {registered ? (
                      <Button
                        variant="secondary"
                        disabled={unregPending}
                        onClick={() => unregisterFromEvent(event.id, {
                          onSuccess: () => toast.success("Unregistered!"),
                          onError: err => toast.error(err.message),
                        })}
                      >
                        Unregister
                      </Button>
                    ) : (
                      <Button
                        className="bg-clubhub-blue text-white"
                        disabled={regPending || full}
                        onClick={() =>
                          registerForEvent(
                            {
                              eventId: event.id,
                              name: profile?.name || user?.user_metadata?.name || "",
                              email: user?.email || "",
                            },
                            {
                              onSuccess: () => toast.success("Registered for event!"),
                              onError: err => toast.error(err.message),
                            }
                          )
                        }
                      >
                        {full ? "Full" : "Register"}
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="registered">
          <div>
            <h2 className="text-xl font-semibold mb-3">My Registered Events</h2>
            {loadingRegisteredEvents ? (
              <div className="text-center text-gray-400 py-20">Loading your registered events...</div>
            ) : registeredEvents.length === 0 ? (
              <div className="text-center text-gray-400 py-20">You haven't registered for any events yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredEvents.map((event: any) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="mb-2 font-bold text-lg">{event.title}</div>
                      <div className="text-sm text-gray-500 mb-2">{event.date} | {event.time}</div>
                      <div className="text-sm text-gray-600 mb-4">{event.location}</div>
                      <p className="line-clamp-2 text-gray-600 mb-4">{event.description}</p>
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={unregPending}
                          onClick={() => unregisterFromEvent(event.id, {
                            onSuccess: () => toast.success("Unregistered successfully!"),
                            onError: err => toast.error(err.message),
                          })}
                        >
                          Unregister
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div>
            <h2 className="text-xl font-semibold mb-3">Profile & Settings</h2>
            <div className="bg-white p-4 rounded border max-w-md">
              {loadingProfile ? (
                <div>Loading profile...</div>
              ) : (
                <form
                  className="flex flex-col gap-3"
                  onSubmit={e => {
                    e.preventDefault();
                    updateProfile(
                      { name: profileName },
                      {
                        onSuccess: () => {
                          setEditingProfile(false);
                          toast.success("Profile updated!");
                        },
                        onError: err => toast.error(err.message),
                      }
                    );
                  }}
                >
                  <div>
                    <label className="block text-sm mb-1">Name</label>
                    <Input
                      type="text"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      disabled={!editingProfile || updatingProfile}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email</label>
                    <Input
                      className="border px-3 py-2 rounded w-full"
                      type="email"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Role</label>
                    <Input
                      value={user?.user_metadata?.role || "student"}
                      disabled
                    />
                  </div>
                  <div className="flex gap-2 items-center mt-2">
                    {editingProfile ? (
                      <>
                        <Button
                          variant="default"
                          type="submit"
                          disabled={updatingProfile}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => {
                            setEditingProfile(false);
                            setProfileName(profile?.name || "");
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setEditingProfile(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboardPage;
