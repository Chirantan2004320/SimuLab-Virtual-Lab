import React from "react";

export default function TreeOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize a Binary Tree, including node insertion and
          traversals such as inorder, preorder, and postorder.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A tree is a hierarchical data structure made up of nodes connected by edges.
          A <strong>Binary Tree</strong> is a special type of tree where each node can have
          at most two children:
        </p>

        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li><strong>Left child</strong></li>
          <li><strong>Right child</strong></li>
        </ul>

        <p>
          <strong>Important terms:</strong>
        </p>

        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Root – the top node of the tree</li>
          <li>Leaf – a node with no children</li>
          <li>Subtree – a smaller tree inside a tree</li>
          <li>Parent / Child – relationship between connected nodes</li>
        </ul>

        <p>
          <strong>Common traversals:</strong>
        </p>

        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Preorder: Root → Left → Right</li>
          <li>Inorder: Left → Root → Right</li>
          <li>Postorder: Left → Right → Root</li>
        </ul>

        <p>
          Binary Trees are used in expression trees, hierarchical storage, recursion,
          and as a foundation for more advanced trees like BST, Heap, and AVL Trees.
        </p>
      </section>
    </div>
  );
}