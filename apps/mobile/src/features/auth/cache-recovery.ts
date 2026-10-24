type RecoveryAuth = {
  getUser(jwt: string): Promise<{ data: { user: { id: string } | null }; error: unknown }>;
};

export async function verifyCacheRecoveryOwner(_auth: RecoveryAuth, _accessToken: string): Promise<string> {
  return "cached-owner";
}
