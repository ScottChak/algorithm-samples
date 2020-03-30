export interface INeighbour {
  target: string;
  additionalCost: number;
}

export interface IGraph {
  GetNodes(): Promise<Set<string>>;
  GetNeighbours(source: string): Promise<Array<INeighbour>>;
}

export class Path {
  node: string;
  cost: number;
  previous: Path;

  constructor(node: string, cost: number, previous: Path = undefined) {
    this.node = node;
    this.cost = cost;
    this.previous = previous;
  }
}

export interface IDijsktraOptions {
  target?: string;
}

interface IDijsktraConfiguration {
  target: string;
}

function getConfiguration(options: IDijsktraOptions): IDijsktraConfiguration {
  //  Initialise default configuration
  let configuration: IDijsktraConfiguration = {
    target: undefined
  };

  //  Apply overrides from options
  if (options !== undefined) {
    Object.assign(configuration, options);
  }

  return configuration;
}

export async function solve(
  source: string,
  graph: IGraph,
  options: IDijsktraOptions = undefined
): Promise<Map<string, Path>> {
  let configuration: IDijsktraConfiguration = getConfiguration(options);

  //  Initialise results
  let results: Map<string, Path> = new Map<string, Path>();
  results.set(source, new Path(source, 0));

  //  If configuration.target === source, then already solved
  if (configuration.target !== source) {
    //  Get the nodes
    let nodes: Set<string> = await graph.GetNodes();

    //  Create a set of unvisited
    let unvisited: Set<string> = new Set<string>([...nodes]);

    //  While there is still unvisted nodes and target is not found
    while (unvisited.size !== 0 && (configuration.target === undefined || !results.has(configuration.target))) {
      //  Get the unvisited node with the lowest cost
      let current: string = [...unvisited]
        .map((v: string, i: number) => {
          return { node: v, cost: results.has(v) ? results.get(v).cost : Infinity };
        })
        .sort((a, b) => a.cost - b.cost)
        .pop().node;

      //  Get its neighbours
      let neighbours = await graph.GetNeighbours(current);
      neighbours.forEach((n: INeighbour, i: number) => {
        let newCost: number = results[current].cost + n.additionalCost;

        if (!results.has(n.target)) {
          results.set(n.target, new Path(n.target, newCost, results.get(current)));
        } else if (newCost < results[n.target].cost) {
          results[n.target].cost = newCost;
          results[n.target].previous = current;
        }
      });

      unvisited.delete(current);
    }
  }

  return results;
}
