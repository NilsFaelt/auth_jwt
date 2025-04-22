import { postgresClientTokens } from "../../../pg/client";

export const revokeRefreshTokenPG = async ({ id }: { id: string }) => {
  try {
    const revokedToken = await postgresClientTokens.query(
      "UPDATE TOKENS SET revoked = $1 WHERE sub = $2",
      [true, id]
    );
    await postgresClientTokens.query("SELECT * FROM TOKENS WHERE SUB = $1", [
      id,
    ]);
    console.log(revokedToken.rows, "TOKENN");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate refresh token");
  }
};
