import { useUserState } from "@/stores/user.store";
import { LogOut, LucideLoader2 } from "lucide-react";
import { CgGym } from "react-icons/cg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase";

const UserBox = () => {
  const { user, setUser } = useUserState();

  if (!user) return <LucideLoader2 className="animate-spin" />;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      navigate("/auth");
    });
  };
  
  return (
    <DropdownMenu >
     <DropdownMenuTrigger asChild>
  <button type="button">
    <Avatar className="cursor-pointer">
      <AvatarImage src={user.photoURL!} alt="avatar" />
      <AvatarFallback className="uppercase">
        {user.email![0]}
      </AvatarFallback>
    </Avatar>
  </button>
</DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 me-3"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-2 gap-2 p-2 ">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user.email}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar>
                <AvatarImage src={user.photoURL!} alt="avatar" />
                <AvatarFallback className="uppercase">
                  {user.email![0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="line-clamp-1">{user.displayName ?? user.email}</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className=" px-1 pb-2">
          <DropdownMenuItem className="cursor-pointer mt-2" onClick={()=>navigate('/dashboard')}>
            <CgGym className="w-4 h-4 mr-2" />
            <span>Gym</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer mt-2 bg-destructive"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserBox;
