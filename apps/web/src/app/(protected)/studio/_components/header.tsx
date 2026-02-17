"use client";

import {
  ImageIcon,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Crown,
  Coins,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getProfile, logout } from "@/resources/auth";
import { User as UserType } from "@/resources/user";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { PricingDialog } from "@/components/dialogs/pricing-dialog";

export default function StudioHeader() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProfile()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="border-b py-2">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <Link href="/studio">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-linear-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <ImageIcon className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Kroma</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {loading ? (
            <>
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="size-12 rounded-full" />
            </>
          ) : (
            <>
              <button
                onClick={() => setIsPricingOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition-colors"
              >
                <Coins className="size-4 text-muted-foreground" />
                <span className="font-medium">{user?.credits ?? 0}</span>
                <span className="text-muted-foreground">créditos</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="size-12 cursor-pointer rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors focus:outline-none">
                    {user?.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsPricingOpen(true)}
                    className="cursor-pointer"
                  >
                    <Crown className="text-yellow-500" />
                    <span className="font-medium">Fazer Upgrade</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="cursor-pointer">
                      <HelpCircle />
                      Ajuda
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                    variant="destructive"
                  >
                    <LogOut />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
      <PricingDialog open={isPricingOpen} onOpenChange={setIsPricingOpen} />
    </header>
  );
}
