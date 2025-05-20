"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [msg, setMsg] = useState<string | null>(null);

  async function handleVerify() {
    setMsg("verifying…");

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
      verify_proof(proof, imageId);
    } catch (e) {
      console.error(e);
    }
    const t1 = performance.now();
    setMsg(`Proof verified in ${(t1-t0).toFixed(2)} ms`);
  }

  function fibBig(n: number) {
    setMsg("Calculating…");
    setTimeout(() => {
      const t0 = performance.now();
      let a = 0n;
      let b = 1n;
      for (let i = 0; i < n; i++) {
        [a, b] = [b, a + b];
      }
      const t1 = performance.now();
      setMsg(`100000th Fibonacci has ${a.toString().length} digits (calculated in ${(t1-t0).toFixed(2)} ms)`);
    }, 0);
  }

  return (
    <main className="flex flex-col items-center gap-4 p-6">
      <Button onClick={() => fibBig(1000000)}>Calculate 100000th Fibonacci</Button>
      {msg && <p>{msg}</p>}
      <Button onClick={handleVerify}>Verify Proof</Button>
    </main>
  );
}
