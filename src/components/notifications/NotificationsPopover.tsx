import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function NotificationsPopover() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        if (user.user_metadata?.role === "organizer") {
          // For organizers: Get recent club members
          const { data: memberData, error: memberError } = await supabase
            .from("club_members")
            .select(`
              id,
              name,
              email,
              joined_at,
              clubs:club_id (name)
            `)
            .order('joined_at', { ascending: false })
            .limit(10);

          if (memberError) throw memberError;
          setNotifications(memberData || []);
        } else {
          // For students: Get recent announcements
          const { data: announcementData, error: announcementError } = await supabase
            .from("club_announcements")
            .select(`
              id,
              title,
              content,
              created_at,
              clubs:club_id (name)
            `)
            .order('created_at', { ascending: false })
            .limit(10);

          if (announcementError) throw announcementError;
          setNotifications(announcementData || []);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const renderNotification = (item: any) => {
    if (user?.user_metadata?.role === "organizer") {
      return (
        <div key={item.id} className="p-4 border-b last:border-0">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">
            joined {item.clubs.name}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(item.joined_at).toLocaleDateString()}
          </p>
        </div>
      );
    }

    return (
      <div key={item.id} className="p-4 border-b last:border-0">
        <p className="font-medium">{item.title}</p>
        <p className="text-sm text-gray-500">
          {item.clubs.name}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(item.created_at).toLocaleDateString()}
        </p>
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="px-4 py-2 bg-muted/50 border-b">
          <h3 className="font-semibold">
            {user?.user_metadata?.role === "organizer" ? "Recent Members" : "Recent Announcements"}
          </h3>
        </div>
        <ScrollArea className="h-80">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No new notifications</div>
          ) : (
            notifications.map(renderNotification)
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}