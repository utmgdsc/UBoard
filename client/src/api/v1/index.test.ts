import ServerApi from "./";

jest.mock("axios", () => ({
  ...(jest.requireActual("axios") as any),
  create: (path: string) => {
    return {
      post: jest.fn().mockImplementation(
        (path: string, form: any) =>
          new Promise((resolve, reject) => {
            if (form.valid) {
              resolve({ data: {} });
            } else {
              reject({ response: {} });
            }
          })
      ),
    };
  },
}));

describe("ServerApi class", () => {
  describe("post method", () => {
    it("should return Promise with error property on error", async () => {
      const api = new ServerApi();
      const result = await api.post("/test/path", { valid: false });
      expect(result.response).not.toBeDefined();
      expect(result.error).toBeDefined();
    });

    it("should return Promise with response property on success", async () => {
      const api = new ServerApi();
      const result = await api.post("/test/path", { valid: true });
      expect(result.response).toBeDefined();
      expect(result.error).not.toBeDefined();
    });
  });
});
// empty export resolves ts isolatedModules error
export {};
