import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Bell, BellOff, UserPlus, UserMinus, Edit, Share, Info } from "lucide-react";
import { useClubDetails, useClubDetailsWithAnnouncements } from "@/hooks/useClubDetails";
import { useClubEvents } from "@/hooks/useEventManagement";
import { useJoinClub, useLeaveClub, useFollowClub, useUnfollowClub, isValidUUID } from "@/hooks/useClubs";
import { supabase } from "@/integrations/supabase/client";
import EventCard from "@/components/events/EventCard";
import { toast } from "sonner";

const ClubDetailsPage = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { clubDetails: { data: club, isLoading: loadingClub }, announcements: { data: announcements = [], isLoading: loadingAnnouncements } } = useClubDetailsWithAnnouncements(clubId);
  const { data: events = [], isLoading: loadingEvents } = useClubEvents(clubId || "");
  
  const [activeTab, setActiveTab] = useState("about");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMember, setIsMember] = useState(false);
  
  const { mutate: joinClubMutation, isPending: joiningClub } = useJoinClub();
  const { mutate: leaveClubMutation, isPending: leavingClub } = useLeaveClub();
  const { mutate: followClubMutation, isPending: followingClub } = useFollowClub();
  const { mutate: unfollowClubMutation, isPending: unfollowingClub } = useUnfollowClub();

  const isOrganizer = useMemo(() => {
    if (!user || !club) return false;
    return club.organizerId === user.id || (club.leads || []).includes(user.id);
  }, [user, club]);

  useEffect(() => {
    const checkMembershipStatus = async () => {
      if (!user || !clubId) return;
      
      try {
        const { data, error } = await supabase
          .from("club_members")
          .select("id")
          .eq("club_id", clubId)
          .eq("user_id", user.id)
          .limit(1)
          .single();
        
        if (error) {
          console.error("Error checking membership:", error.message);
        }
        
        setIsMember(!!data);
      } catch (err) {
        console.error("Failed to check membership:", err);
      }
    };
    
    const checkFollowingStatus = async () => {
      if (!user || !clubId) return;
      
      try {
        const { data, error } = await supabase
          .from("club_followers")
          .select("id")
          .eq("club_id", clubId)
          .eq("user_id", user.id)
          .limit(1)
          .single();
        
        if (error) {
          console.error("Error checking following status:", error.message);
        }
        
        setIsFollowing(!!data);
      } catch (err) {
        console.error("Failed to check following status:", err);
      }
    };
    
    checkMembershipStatus();
    checkFollowingStatus();
  }, [user, clubId]);

  const handleJoinClub = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join clubs",
        variant: "destructive",
      });
      return;
    }

    joinClubMutation(clubId || "", {
      onSuccess: () => {
        setIsMember(true);
        toast({
          title: "Success",
          description: "You have joined the club!",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleLeaveClub = () => {
    if (!user) return;

    leaveClubMutation(clubId || "", {
      onSuccess: () => {
        setIsMember(false);
        toast({
          title: "Success",
          description: "You have left the club",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleFollowClub = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow clubs",
        variant: "destructive",
      });
      return;
    }

    followClubMutation(clubId || "", {
      onSuccess: () => {
        setIsFollowing(true);
        toast({
          title: "Success",
          description: "You are now following this club",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleUnfollowClub = () => {
    if (!user) return;

    unfollowClubMutation(clubId || "", {
      onSuccess: () => {
        setIsFollowing(false);
        toast({
          title: "Success",
          description: "You have unfollowed this club",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: club?.name || "Club Details",
      text: club?.description || "",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Club link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loadingClub) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-xl">Loading club information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!club) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Club not found</h1>
            <p className="mb-4">The club you're looking for doesn't exist or has been removed.</p>
            <Link to="/clubs">
              <Button>Back to Clubs</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Club header with action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{club.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center">
                <Users className="mr-1" size={18} />
                {club.memberCount || 0} Members
              </span>
              <span className="flex items-center">
                <Calendar className="mr-1" size={18} />
                {club.eventCount || 0} Events
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {user && !isOrganizer && (
              <>
                {isMember ? (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleLeaveClub}
                    disabled={leavingClub}
                  >
                    <UserMinus size={18} />
                    Leave Club
                  </Button>
                ) : (
                  <Button
                    className="gap-2"
                    onClick={handleJoinClub}
                    disabled={joiningClub}
                  >
                    <UserPlus size={18} />
                    Join Club
                  </Button>
                )}

                {isFollowing ? (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleUnfollowClub}
                    disabled={unfollowingClub}
                  >
                    <BellOff size={18} />
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleFollowClub}
                    disabled={followingClub}
                  >
                    <Bell size={18} />
                    Follow
                  </Button>
                )}
              </>
            )}

            <Button
              variant="outline"
              className="gap-2"
              onClick={handleShare}
            >
              <Share size={18} />
              Share
            </Button>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="animate-fade-in">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {club.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{club.description}</p>
                </CardContent>
              </Card>
              
              {club.vision && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{club.vision}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              {isOrganizer && (
                <Button>
                  <Calendar className="mr-2" size={18} />
                  Add New Event
                </Button>
              )}
            </div>
            
            {loadingEvents ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">Loading events...</p>
                </CardContent>
              </Card>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <Link key={event.id} to={`/events/${event.id}`}>
                    <EventCard {...event} />
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">No upcoming events at the moment</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="announcements" className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Announcements</h2>
              {isOrganizer && (
                <Button>Post Announcement</Button>
              )}
            </div>
            
            {loadingAnnouncements ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">Loading announcements...</p>
                </CardContent>
              </Card>
            ) : announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <Card key={announcement.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{announcement.title}</CardTitle>
                        <Badge variant="outline">
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                      <CardDescription>Posted by {announcement.created_by}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">No announcements at the moment</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClubDetailsPage;