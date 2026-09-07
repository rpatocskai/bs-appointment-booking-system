import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button Komponens", () => {
  it("megfelelően rendereli a szöveget (children)", () => {
    // 1.Virtual render for a button
    render(<Button>Kattints rám</Button>);

    // 2. Search button by text
    const buttonElement = screen.getByRole("button", { name: /kattints rám/i });

    // 3. Expect DOM
    expect(buttonElement).toBeInTheDocument();
  });

  it("meghívja az onClick függvényt ha rákattintanak", async () => {
    //  Mock function, as  Jasmine spy)
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Mentés</Button>);

    const buttonElement = screen.getByRole("button", { name: /mentés/i });

    // Simulate user clicking
    await userEvent.click(buttonElement);

    // Expect click have been called once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("letiltja a gombot és mutatja a töltést, ha az isLoading prop true", () => {
    render(<Button isLoading>Mentés</Button>);

    const buttonElement = screen.getByRole("button");

    // Expect button to be disabled
    expect(buttonElement).toBeDisabled();
  });
});
