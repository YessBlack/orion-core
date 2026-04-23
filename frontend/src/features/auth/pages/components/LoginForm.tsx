import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRightIcon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"
import { Link } from "react-router-dom"
import { useLoginForm } from "../../presentation/hooks/useLoginForm"

export const LoginForm = () => {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useLoginForm()

  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="mb-2 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#E5E7EB]">
          Iniciar sesión
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#9CA3AF]">
          Ingrese sus credenciales para acceder al sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-800 dark:text-[#E5E7EB]">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={values.email}
            onChange={handleChange}
            className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:ring-violet-400/35 dark:border-[#1E1B4B] dark:bg-[#151b2C]/70 dark:text-[#E5E7EB] dark:placeholder:text-[#9CA3AF] dark:focus-visible:border-[#A78BFA] dark:focus-visible:ring-[#A78BFA]/35"
          />
          {errors.email && (
            <p className="m-0 p-0 text-[11px] text-red-500 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-semibold text-slate-800 dark:text-[#E5E7EB]">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              className="border-slate-300 bg-white pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:ring-violet-400/35 dark:border-[#1E1B4B] dark:bg-[#151b2C]/70 dark:text-[#E5E7EB] dark:placeholder:text-[#9CA3AF] dark:focus-visible:border-[#A78BFA] dark:focus-visible:ring-[#A78BFA]/35"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:translate-y-[-50%]! active:scale-100! dark:text-[#9CA3AF] dark:hover:bg-[#1E1B4B]/50 dark:hover:text-[#E5E7EB]"
              onClick={() => setShowPassword((v) => !v)}
            >
              <span className="inline-flex size-4 items-center justify-center">
                <HugeiconsIcon
                  icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                  size={16}
                  color="currentColor"
                />
              </span>
            </Button>
          </div>
          {errors.password && (
            <p className="m-0 p-0 text-[11px] text-red-500 dark:text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        {errors.server && (
          <p className="m-0 p-0 text-[11px] text-red-500 dark:text-red-400">
            {errors.server}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="mt-1 h-11 w-full justify-center gap-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9]"
          disabled={isSubmitting}
        >
          <span>Ingresar</span>
          <HugeiconsIcon icon={ArrowRightIcon} size={16} />
        </Button>
      </form>

      <div className="flex justify-center">
        <Link
          to="/forgot-password"
          className="text-xs font-medium text-violet-600 transition-colors hover:text-violet-500 hover:underline dark:text-[#A78BFA] dark:hover:text-[#C4B5FD]"
        >
          Recuperar contraseña
        </Link>
      </div>
    </div>
  )
}
