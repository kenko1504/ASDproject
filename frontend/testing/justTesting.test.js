import { render, screen, fireEvent } from "@testing-library/react";
import AddButton from "../src/components/DashboardComponent/AddButton";

//testing if add button renders correctly
test("renders add button with correct text", () => {
  render(<AddButton />);
  const buttonElement = screen.getByText("+");
  expect(buttonElement).toBeInTheDocument();
});
