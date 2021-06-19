import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import { RegisterForm } from "./register-form";

const createRegisterInfo = () => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

test("submitting the form calls onClick with the username, email and password", async () => {
  const handleOnClick = jest.fn();
  const { username, email, password } = createRegisterInfo();

  render(<RegisterForm onClick={handleOnClick} />);

  const usernameInput = screen.getByPlaceholderText(/username/i);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.type(usernameInput, username);
  userEvent.type(emailInput, email);
  userEvent.type(passwordInput, password);

  userEvent.click(registerButton);

  // wait for react hook form
  await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));

  expect(handleOnClick).toHaveBeenCalledWith({ username, email, password });
  expect(handleOnClick).toHaveBeenCalledTimes(1);
});

test("submitting the form without username shows error", async () => {
  const handleOnClick = jest.fn();
  const { email, password } = createRegisterInfo();

  render(<RegisterForm onClick={handleOnClick} />);

  const passwordInput = screen.getByPlaceholderText(/password/i);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.type(emailInput, email);
  userEvent.type(passwordInput, password);

  userEvent.click(registerButton);

  // wait for react hook form
  await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));

  expect(screen.getByText(/please choose a username/i)).toBeInTheDocument();
});

test("submitting the form without email shows error", async () => {
  const handleOnClick = jest.fn();
  const { username, password } = createRegisterInfo();

  render(<RegisterForm onClick={handleOnClick} />);

  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.type(usernameInput, username);
  userEvent.type(passwordInput, password);

  userEvent.click(registerButton);

  // wait for react hook form
  await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));

  expect(screen.getByText(/your email is required/i)).toBeInTheDocument();
});

test("submitting the form without password shows error", async () => {
  const handleOnClick = jest.fn();
  const { username, email } = createRegisterInfo();

  render(<RegisterForm onClick={handleOnClick} />);

  const usernameInput = screen.getByPlaceholderText(/username/i);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.type(usernameInput, username);
  userEvent.type(emailInput, email);

  userEvent.click(registerButton);

  // wait for react hook form
  await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));

  expect(screen.getByText(/Please fill in your password/i)).toBeInTheDocument();
});

test("submitting the form with and invalid email shows error", async () => {
  const handleOnClick = jest.fn();
  const email = "invalid@email";
  const { username, password } = createRegisterInfo();

  render(<RegisterForm onClick={handleOnClick} />);

  const usernameInput = screen.getByPlaceholderText(/username/i);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const registerButton = screen.getByRole("button", { name: /register/i });

  userEvent.type(usernameInput, username);
  userEvent.type(emailInput, email);
  userEvent.type(passwordInput, password);

  userEvent.click(registerButton);

  // wait for react hook form
  await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));

  expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
});
