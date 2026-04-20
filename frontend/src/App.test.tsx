import { render, screen } from "@testing-library/react"
import { App } from "./App"

describe("App", () => {
  it("renders login route when user is not authenticated", async () => {
    render(<App />)

    expect(await screen.findByText("Login")).toBeInTheDocument()
  })
})
