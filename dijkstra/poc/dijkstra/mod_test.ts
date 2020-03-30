import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { IGraph, IDijsktraOptions, solve, INeighbour } from "./mod.ts";

class Node {
  id: string;
  neighbours: INeighbour[];
}

class TestGraph implements IGraph {
  nodes: Map<string, Node>;

  TestGraph() {
    this.nodes = new Map<string, Node>();
  }

  Add(node: Node) {
    this.nodes.set(node.id, node);
  }

  async GetNodes(): Promise<Set<string>> {
    return new Set(...this.nodes.keys());
  }

  async GetNeighbours(source: string): Promise<Array<INeighbour>> {
    return this.nodes.get(source).neighbours;
  }
}

Deno.test({
  name: "Only single node",
  fn: async function(): Promise<void> {
    let sourceId = "source";
    let graph = new TestGraph();

    graph.Add({
      id: sourceId,
      neighbours: []
    });

    let results = await solve(sourceId, graph);

    console.log(results);
  }
});

await Deno.runTests();
