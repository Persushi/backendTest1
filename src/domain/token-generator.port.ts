export interface TokenGeneratorPort {
  generate(payload: Record<string, unknown>): string;
}
