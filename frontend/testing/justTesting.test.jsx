import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import AddButton from "../src/components/DashboardComponent/AddButton";

//testing if add button renders correctly
test('renders add button with correct text', () => {
  render(<AddButton />);
  const buttonElement = screen.getByText('+');

  // optionally check the text content explicitly
  expect(buttonElement.textContent).toBe('+');
  if (expect(buttonElement.textContent).toBe('+')) {
    console.log("Add button ui rendered correctly with text: +");
  }
  else {
    console.error("Add button ui did not render correctly");
  }
});
