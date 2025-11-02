import { useState } from "react";
import "./App.css";
// @ts-ignore
import asciitree from "ascii-tree";

interface Tree {
  id: string;
  children: string[];
}

const buildTree = (input: string): Tree[] | string => {
  const tree: Tree[] = [];
  const contexts = input.split(";");

  for (const context of contexts) {
    const chain = context.split(">").map((str) => str.trim());

    for (let i = 0; i < chain.length - 1; i++) {
      const parent = chain[i];
      const children = chain[i + 1].split(",").map((str) => str.trim());

      const parentNode = tree.find(({ id }) => id === parent);

      if (parentNode) {
        parentNode.children.push(...children);
      } else {
        tree.push({ id: parent, children: [...children] });
      }

      for (const child of children) {
        if (!tree.find(({ id }) => id === child)) {
          tree.push({ id: child, children: [] });
        }
      }
    }
  }

  for (const node of tree) {
    node.children = [...new Set(node.children)];

    if (node.children.includes(node.id)) {
      return "Invalid! Node cannot be a parent of itself";
    }
  }

  return tree;
};

const getDisplayTree = (tree: Tree[]): string => {
  const childNodes = tree.flatMap(({ children }) => children);
  const root = tree.find(({ id }) => !childNodes.includes(id));

  if (!root) {
    return "Invalid! No root found / cycle detected";
  }

  const buildTreeString = (nodeId: string, depth = 1) => {
    let result = "#".repeat(depth) + nodeId + "\n";

    const { children } = tree.find(({ id }) => id === nodeId)!;

    if (children.length > 0) {
      for (const child of children) {
        result += buildTreeString(child, depth + 1);
      }
    }

    return result;
  };

  return asciitree.generate(buildTreeString(root.id));
};

export const App = () => {
  // const initialTreeInput = "A > B, C" // 1
  // const initialTreeInput = "A > B > C, D; A > E" // 2
  // const initialTreeInput = "A > B; A > B" // 3
  // const initialTreeInput = "A > B , C ; " // 4
  // const initialTreeInput = "A > B, C; A > C, D" // 5
  // const initialTreeInput = "A > B > C; B > A" // 6
  // const initialTreeInput = "A > A" // 7
  // const initialTreeInput = "A > B; B > C; C > A" // 8
  // const initialTreeInput = "A > B; X > Y, Z" // 9
  const initialTreeInput = "A > B > C; A > D; B > E"; // 10

  const [input, setInput] = useState(initialTreeInput);
  const [treeOutput, setTreeOutput] = useState<string>();

  const handleClick = () => {
    const treeResult = buildTree(input);

    if (typeof treeResult === "string") {
      setTreeOutput(treeResult);
    } else {
      setTreeOutput(getDisplayTree(treeResult));
    }
  };

  return (
    <div>
      <input
        style={{
          width: "100%",
          marginBottom: "12px",
          padding: "12px",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <button
        style={{
          width: "100%",
          marginBottom: "12px",
          padding: "12px",
          fontSize: "16px",
        }}
        onClick={handleClick}
      >
        Build Tree
      </button>
      <pre>{treeOutput}</pre>
    </div>
  );
};
