const base = {
  get: () => $api<string>("/api"),
};

export default base;
