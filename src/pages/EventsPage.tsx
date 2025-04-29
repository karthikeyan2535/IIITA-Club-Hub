
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllUpcomingEvents } from "@/hooks/useEventManagement";
import { useClubs } from "@/hooks/useClubs";
import { useMyEventRegistrations } from "@/hooks/useEventRegistration";

const EventsPage = () => {
  const { data: events = [], isLoading: loadingEvents } = useAllUpcomingEvents();
  const { data: clubs = [] } = useClubs();
  const { data: registrations = [] } = useMyEventRegistrations();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [selectedDate, setSelectedDate] = useState("upcoming");
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClub = selectedClub === "all" || event.club_id === selectedClub;
    
    // Date filtering
    const today = new Date().toISOString().split('T')[0];
    const eventDate = event.date;
    
    let matchesDate = true;
    if (selectedDate === "today") {
      matchesDate = eventDate === today;
    } else if (selectedDate === "week") {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];
      matchesDate = eventDate >= today && eventDate <= nextWeekStr;
    } else if (selectedDate === "month") {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = nextMonth.toISOString().split('T')[0];
      matchesDate = eventDate >= today && eventDate <= nextMonthStr;
    }
    
    return matchesSearch && matchesClub && matchesDate;
  });

  return (
    <Layout>
      <div className="bg-clubhub-gray-light min-h-screen py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8 text-clubhub-gray-dark">Upcoming Events</h1>
          
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Input 
                type="text" 
                placeholder="Search events..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedClub} onValueChange={setSelectedClub}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by club" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clubs</SelectItem>
                  {clubs.map((club: any) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">All Upcoming</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Events grid */}
          {loadingEvents ? (
            <div className="text-center py-12">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-gray-500">Try changing your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const club = clubs.find((c: any) => c.id === event.club_id) || { name: event.club_name };
                const isRegistered = registrations.includes(event.id);
                
                return (
                  <EventCard 
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    clubName={club.name}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    imageUrl={event.image_url || "/placeholder.svg"}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage;
