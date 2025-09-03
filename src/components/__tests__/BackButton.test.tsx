import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import BackButton from "../BackButton";

// Mock Next.js useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("BackButton Component", () => {
  const mockBack = jest.fn();
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  beforeEach(() => {
    // Reset mock sebelum setiap test
    mockBack.mockClear();
    mockUseRouter.mockReturnValue({
      back: mockBack,
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  it("should render the back button with correct text", () => {
    render(<BackButton />);

    // Cari button dengan text "Kembali"
    const backButton = screen.getByText("Kembali");
    expect(backButton).toBeInTheDocument();
  });

  it("should call router.back() when back button is clicked", () => {
    render(<BackButton />);

    const backButton = screen.getByText("Kembali");

    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("should be a button element", () => {
    render(<BackButton />);

    const button = screen.getByRole("button").tagName;
    expect(button).toBe("BUTTON");
  });

  it("should render button with correct classes", () => {
    render(<BackButton />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("mb-6 gap-2");
  });
});
