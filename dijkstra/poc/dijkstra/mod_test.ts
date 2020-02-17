import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno..test({
  name: "testing example",
  fn(): void {
    assertEquals("world", "world");
    assertEquals({ hello: "world" }, { hello: "world" });
  }
});

await Deno.runTests();