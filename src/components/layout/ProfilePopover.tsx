
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

type ProfilePopoverProps = {
  user: User;
};

const ProfilePopover = ({ user }: ProfilePopoverProps) => {
  // Try to get 'name' and 'role' from user.user_metadata, fallback to email prefix and "student"
  const name: string = (user.user_metadata && user.user_metadata.name) || user.email?.split("@")[0] || "User";
  const role: string = (user.user_metadata && user.user_metadata.role) || "student";
  const email: string = user.email || "-";
  const initial = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center ml-2 focus:outline-none"
          aria-label="Profile"
        >
          <Avatar className="w-8 h-8 border border-white">
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="min-w-[220px] p-3" sideOffset={8}>
        <div className="flex flex-col gap-1">
          <div>
            <span className="font-semibold">{name}</span>
          </div>
          <div className="text-sm text-gray-700 break-all">{email}</div>
          <div className="mt-2 text-xs text-gray-500">
            Role: <span className="capitalize">{role}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default ProfilePopover;
