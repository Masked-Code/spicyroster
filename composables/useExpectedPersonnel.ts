type Person = { name: string; title: string };

export const useExpectedPersonnel = (): Person[] => {
  const {
    public: { expectedPersonnel },
  } = useRuntimeConfig();
  const parsed: unknown =
    typeof expectedPersonnel === 'string'
      ? JSON.parse(expectedPersonnel || '[]')
      : expectedPersonnel;

  if (Array.isArray(parsed)) return parsed as Person[];
  return [];
};