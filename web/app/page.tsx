"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
// import { JsCodeBlock } from "@/components/js-code-block"
import { TabbedCodeBlock } from "@/components/tabbed-code-block"

export default function Home() {
  const [localMsg, setLocalMsg] = useState<string | null>(null);
  const [proofMsg, setProofMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("wasm");
  const [fibCalcTimeMs, setFibCalcTimeMs] = useState<number | null>(null);

  async function handleVerify() {
    setProofMsg("Verifying Proof");

    // dynamic import keeps the code off the server bundle
    const { default: init, verify_proof } = await import(
      /* webpackIgnore: true */ "/wasm/pkg/verifier.js"
    );

    // load the .wasm file
    await init();

    // get the binary blobs you already have in /public/proof_data
    const proofResponse = await fetch("/proof_data/receipt.bin");
    const proof = new Uint8Array(await proofResponse.arrayBuffer());

    const imageIdResponse = await fetch("/proof_data/image_id.bin");
    const imageId = new Uint8Array(await imageIdResponse.arrayBuffer());

    const t0 = performance.now();
    try {
      const journalValue = verify_proof(proof, imageId);
      const t1 = performance.now();
      const verificationTimeMs = t1 - t0;
      
      let message = `Proof verified in ${verificationTimeMs.toFixed(2)} ms\nThe 1000000th Fibonacci number is proven to have ${journalValue} digits.`;
      
      if (fibCalcTimeMs !== null) {
        const speedup = (fibCalcTimeMs / verificationTimeMs).toFixed(2);
        message += `\nProof verification was ${speedup} times quicker than calculating locally.`;
      }
      
      setProofMsg(message);
    } catch (e) {
      console.error(e);
      setProofMsg("Proof verification failed");
    }
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
      const calcTimeMs = t1 - t0;
      setFibCalcTimeMs(calcTimeMs);
      setLocalMsg(`${n}th Fibonacci has ${a.toString().length} digits (calculated in ${(calcTimeMs / 1000).toFixed(3)} seconds)`);
    }, 0);
  }

  return (
    <main className="flex flex-col items-center gap-4 p-6">
      <div className="flex flex-col items-center">
        <TabbedCodeBlock activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "fibonacci" && (
          <>
            <Button onClick={() => fibBig(1000000)}>Calculate 1000000th Fibonacci</Button>
            <div className="mt-4">
              {localMsg ? (
                <div className="flex flex-col gap-2">
                  {localMsg.split('\n').map((line, index) => (
                    <p key={index} className={index === 0 ? "text-center font-medium" : "whitespace-pre-line"}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        )}

        {activeTab === "wasm" && (
          <>
            <Button onClick={handleVerify}>Verify Proof</Button>
            <div className="mt-4">
              {proofMsg ? (
                <div className="flex flex-col gap-2">
                  {proofMsg.split('\n').map((line, index) => (
                    <p key={index} className={index === 0 ? "text-center font-medium" : "whitespace-pre-line"}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
