import { render, screen } from "@/test/test-utils"
import { App } from "./App"

describe("App", () => {
  it("renders Orion Core title", () => {
    render(<App />)

    expect(screen.getByText("Orion Core")).toBeInTheDocument()
  })
})
