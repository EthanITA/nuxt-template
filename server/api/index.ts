export default defineEventHandler((event) => {
  return `Now is ${new Date().toISOString()}`;
});
