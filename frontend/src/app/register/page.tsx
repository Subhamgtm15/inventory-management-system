"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useAuth";
import { getToken } from "@/lib/auth";
import { getErrorMessage, getFieldErrors } from "@/lib/errors";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  const serverErrors = getFieldErrors(registerUser.error);

  const onSubmit = (values: RegisterForm) => registerUser.mutate(values);

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
            IM
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Sign up to get started</p>
        </div>

        {registerUser.isError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {getErrorMessage(registerUser.error)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            autoComplete="name"
            error={errors.name?.message ?? serverErrors.name}
            {...register("name", { required: "Name is required" })}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message ?? serverErrors.email}
            {...register("email", { required: "Email is required" })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message ?? serverErrors.password}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
          />
          <Input
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            error={errors.password_confirmation?.message}
            {...register("password_confirmation", {
              required: "Please confirm your password",
              validate: (v) => v === password || "Passwords do not match",
            })}
          />
          <Button type="submit" className="w-full" loading={registerUser.isPending}>
            Sign up
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
