
import Layout from "@/components/layout/Layout";
import ClubCard from "@/components/clubs/ClubCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { useClubs } from "@/hooks/useClubs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useClubImageUpload } from "@/hooks/useClubImageUpload";

// Define categories here instead of importing from self
const categories = ["All Categories", "Technical", "Cultural","Sports"];
const clubCategories = ["Technical", "Cultural", "Sports"];

const ClubsPage = () => {
  // USE SUPABASE FOR AUTH & CLUBS
  const { user } = useAuth();
  const { data: clubs = [], refetch } = useClubs();
  const { toast } = useToast();

  // Organizer role—based on user's role in profile
  const isOrganizer = useMemo(() => {
    return user && user.user_metadata?.role === "organizer";
  }, [user]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Modal state
  const [open, setOpen] = useState(false);

  // Create Club form state
  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: "",
      description: "",
      category: "Technical",
      image: null as File | null,
    }
  });
  const imageFile = watch("image");

  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Image upload util
  const { uploadImage } = useClubImageUpload();

  // Filter clubs
  const filteredClubs = useMemo(() => {
    if (!clubs) return [];
    return clubs.filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || club.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [clubs, searchQuery, selectedCategory]);

  // Modal form submit handler with improved error handling
  const onSubmit = async (formData: any) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      let image_url = "";
      if (formData.image && formData.image[0]) {
        // Upload the image to Supabase storage
        const { url, error } = await uploadImage(formData.image[0]);
        if (error) {
          console.error("Image upload error:", error);
          throw new Error(`Image upload failed: ${error.message || "Unknown error"}`);
        }
        image_url = url;
      }

      // Insert the club to supabase with proper headers and request body
      const { supabase } = await import("@/integrations/supabase/client");
      
      console.log("Creating club with data:", {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        image_url,
        organizer_id: user.id,
      });
      
      const { data, error } = await supabase
        .from("clubs")
        .insert({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          image_url,
          // Save the organizer
          organizer_id: user.id,
          member_count: 0,
          event_count: 0,
          followers: 0
        })
        .select();

      if (error) {
        console.error("Club creation error:", error);
        throw error;
      }

      console.log("Club created successfully:", data);
      
      toast({
        title: "Club created",
        description: `Club "${formData.name}" was created successfully!`,
      });
      
      setOpen(false);
      reset();
      setImagePreview(null);
      await refetch();
    } catch (err: any) {
      console.error("Error creating club:", err);
      toast({
        title: "Error creating club",
        description: err.message || "There was an error. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Image file preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValue("image", e.target.files as unknown as File | null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Layout>
      <div className="bg-clubhub-gray-light min-h-screen py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-4xl font-bold text-clubhub-gray-dark">Explore Clubs</h1>
            {isOrganizer && (
              <Button
                className="flex gap-2 items-center bg-clubhub-blue text-white"
                onClick={() => setOpen(true)}
              >
                <span>
                  <svg className="h-5 w-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </span>
                Create Club
              </Button>
            )}
          </div>
          
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Input 
                type="text" 
                placeholder="Search clubs..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === selectedCategory ? "default" : "outline"}
                  size="sm"
                  className={category === selectedCategory ? "bg-clubhub-blue" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Clubs grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club) => (
              <ClubCard 
                key={club.id} 
                id={club.id}
                name={club.name}
                description={club.description}
                category={club.category}
                memberCount={club.member_count || 0}
                eventCount={club.event_count || 0}
                imageUrl={club.image_url || "/placeholder.svg"}
              />
            ))}
          </div>
        </div>
        {/* Modal for creating a club */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Club</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new club.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <Input {...register("name", { required: true })} required placeholder="Enter club name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <Input {...register("description", { required: true })} required placeholder="What's this club about?" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select {...register("category", { required: true })} className="w-full border rounded p-2">
                  {clubCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 rounded w-full h-40 object-cover" />
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="bg-clubhub-blue text-white">
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ClubsPage;
