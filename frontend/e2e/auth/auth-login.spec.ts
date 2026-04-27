import { expect, test } from "playwright/test"

test("shows the login form for unauthenticated users", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { name: "Iniciar sesión" })).toBeVisible()
  await expect(page.getByLabel("Correo electrónico")).toBeVisible()
  await expect(page.getByLabel("Contraseña")).toBeVisible()
  await expect(page.getByRole("button", { name: "Ingresar" })).toBeVisible()
})
