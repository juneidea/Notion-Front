"use client";

import { ChevronsLeftRight } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDjangoAuth } from "@/hooks/use-django-auth";
import { useAuthStore } from "@/app/store";

const defaultAvatar =
  "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png";

export const UserItem = () => {
  const { user } = useAuthStore();
  const { logout } = useDjangoAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
          data-testid="user-item trigger"
        >
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-5 w-5" data-testid="avatar">
              <AvatarImage src={user.avatar || defaultAvatar} />
            </Avatar>
            <span
              className="text-start font-medium line-clamp-1"
              data-testid="user"
            >
              {user?.username.charAt(0).toUpperCase() + user?.username.slice(1)}
              &apos;s Notion
            </span>
          </div>
          <ChevronsLeftRight
            className="rotate-90 ml-2 text-muted-foreground h-4 w-4"
            data-testid="chevrons"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user.email}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || defaultAvatar} />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm line-clamp-1">
                {user?.username.charAt(0).toUpperCase() +
                  user?.username.slice(1)}
                &apos;s Notion
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="w-full cursor-pointer text-muted-foreground"
        >
          <Button onClick={logout} variant={"outline"} data-testid="logout">
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
