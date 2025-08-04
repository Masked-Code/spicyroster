// composables/useExpectedPersonnel.ts
type Person = { name: string; title: string };

export const useExpectedPersonnel = (): Person[] => {
  const {
    public: { expectedPersonnel },
  } = useRuntimeConfig();

  if (!expectedPersonnel) return [];

  try {
    const parsed: unknown =
      typeof expectedPersonnel === 'string'
        ? JSON.parse(expectedPersonnel)
        : expectedPersonnel;

    return Array.isArray(parsed) ? (parsed as Person[]) : [];
  } catch (e) {
    console.error('Invalid NUXT_EXPECTED_PERSONNEL JSON:', e);
    return [];
  }
};
