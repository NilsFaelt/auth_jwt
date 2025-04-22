import { postgresClientTokens } from "../../../pg/client";

export const storeRefreshTokenPG = async ({
  id,
  exp,
  jti,
}: {
  id: string;
  exp: number;
  jti: string;
}) => {
  await postgresClientTokens.query(
    "INSERT INTO tokens (sub, exp, jti) VALUES($1, $2, $3)",
    [id, exp, jti]
  );
};
