"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [localMsg, setLocalMsg] = useState<string | null>(null);
  const [proofMsg, setProofMsg] = useState<string | null>(null);

  async function handleVerify() {
    setProofMsg("verifying…");

    // dynamic import keeps the code off the server bundle
    const { default: init, verify_proof } = await import(
      /* webpackIgnore: true */ "/wasm/pkg/verifier.js"
    );

    // load the .wasm file
    await init();

    // get the binary blobs you already have in /public/proof_data
    const proof = new Uint8Array(
      await fetch("/proof_data/receipt.bin").then(r => r.arrayBuffer())
    );
    const imageId = new Uint8Array(
      await fetch("/proof_data/image_id.bin").then(r => r.arrayBuffer())
    );

    const t0 = performance.now();
    try {
      const journalValue = verify_proof(proof, imageId);
      const t1 = performance.now();
      setProofMsg(`Proof verified in ${(t1-t0).toFixed(2)} ms\nJournal value: ${journalValue}`);
    } catch (e) {
      console.error(e);
      setProofMsg("Proof verification failed");
  }

  function fibBig(n: number) {
    setLocalMsg("Calculating…");
    setTimeout(() => {
      const t0 = performance.now();
      let a = 0n;
      let b = 1n;
      for (let i = 0; i < n; i++) {
        [a, b] = [b, a + b];
      }
      const t1 = performance.now();
      setLocalMsg(`100000th Fibonacci has ${a.toString().length} digits (calculated in ${(t1-t0).toFixed(2)} ms)`);
    }, 0);
  }

  return (
    <main className="flex flex-col items-center gap-4 p-6">
      <Button onClick={() => fibBig(1000000)}>Calculate 100000th Fibonacci</Button>
      {localMsg && <p>{localMsg}</p>}
      <Button onClick={handleVerify}>Verify Proof</Button>
      {proofMsg && <p>{proofMsg}</p>}
    </main>
  );
}
