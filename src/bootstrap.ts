export async function prepareApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser")
    await worker.start()
  }
}
