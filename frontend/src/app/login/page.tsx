"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/hooks/useAuth";
import { getToken } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "admin@inventory.test", password: "password" },
  });

  // If already logged in, skip the login screen.
  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  const onSubmit = (values: LoginForm) => login.mutate(values);

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
            IM
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        {login.isError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {getErrorMessage(login.error)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />
          <Button type="submit" className="w-full" loading={login.isPending}>
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign up
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-400">
          Demo: admin@inventory.test / password
        </p>
      </div>
    </div>
  );
}
