import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  render as rtlRender,
  screen,
  waitFor,
  within,
  fireEvent,
  type RenderOptions,
} from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { type ReactElement, type ReactNode } from "react"

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

type ProvidersProps = {
  children: ReactNode
}

export const render = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  rtlRender(ui, {
    wrapper: ({ children }: ProvidersProps) => {
      const queryClient = createTestQueryClient()

      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </MemoryRouter>
      )
    },
    ...options,
  })

export { screen, waitFor, within, fireEvent }
