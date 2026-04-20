import { LoginResult } from "../domain/auth.types";
import { AuthDependencies } from "./auth.dependencies";
import { LoginInput } from "./login.input";

export const loginUseCase = async (
  input: LoginInput,
  deps: AuthDependencies
): Promise<LoginResult> => {
  const result = await deps.authRepository.login(input.email, input.password)

  await deps.tokenStorage.save(result.accessToken)

  return result
}
