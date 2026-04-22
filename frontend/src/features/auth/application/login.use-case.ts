import { LoginResult } from "../domain/auth.types";
import { AuthDependencies } from "./auth.dependencies";
import { LoginInput } from "./login.input";

export const loginUseCase = async (
  input: LoginInput,
  deps: AuthDependencies
): Promise<LoginResult> => {
  return await deps.authRepository.login(input.email, input.password)
}
