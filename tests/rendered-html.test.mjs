import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the completed parent guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Мягкий старт/);
  assert.match(html, /Помогите ребёнку/);
  assert.match(html, /7–8 лет/);
  assert.match(html, /9–11 лет/);
  assert.match(html, /12–15 лет/);
  assert.match(html, /Главное после первого сентября/);
  assert.doesNotMatch(html, /0<\/b> регистраций/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/);
});
