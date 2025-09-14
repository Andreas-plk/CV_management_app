'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {getUser} from "@/app/actions";
import {toast} from "sonner";
import {useState} from "react";
import {redirect} from "next/navigation";
import {isRedirectError} from "next/dist/client/components/redirect-error";






export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        try {
            setLoading(true);
            await getUser(fd);
            form.reset();

        } catch (err: any) {
            if (isRedirectError(err)) return;
            toast.warning("Σφάλμα: " + (err.message));
        } finally {
            setLoading(false);
        }
    }



    return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" name="password" placeholder="••••••••" required />
              </div>
              <div className="flex flex-col gap-3">
                  <Button type="submit" disabled={loading} className="w-full cursor-pointer">
                      {loading ? "Φόρτωση..." : "Είσοδος"}
                  </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signUp" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
