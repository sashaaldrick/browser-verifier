# R0VM Browser Verifier

This repository contains a monorepo for the R0VM Browser Verifier project, which demonstrates zero-knowledge proof verification in the browser. The project is organized into two main directories:

## Project Structure

```
browser_verifier/
├── rust/         # Rust code for generating and verifying proofs
│   ├── guest/    # R0VM guest code that gets executed and proven
│   ├── host/     # R0VM host code for generating proofs
│   └── verifier/ # WebAssembly-compatible proof verification library
└── web/          # Next.js web application for in-browser proof verification
```


### Running the Web App

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Rust Components

The `rust/` directory contains the zero-knowledge proof system components:

### guest/

The guest code contains the program that runs inside the R0VM (RISC Zero Virtual Machine). This is the computation that gets proven. In this project, it calculates the 1000000th Fibonacci number and commits the length of that number to the journal.

### host/

The host code is responsible for:
- Loading and executing the guest program in the R0VM
- Generating proofs of correct execution
- Serializing the proof and the imageID into binary files that can be used by the verifier in the browser.

The host serializes these into 'receipt.bin' and 'image_id.bin' in the web application's public folder.

To run the host yourself:

```bash
cd rust/
cargo run --release
```

This will overwrite the proof files in the web app which could cause failure. The binaries are included directly in the repo, so you shouldn't need to do this unless you're modifying things. If so, have fun!

### verifier/

The verifier is a Rust library that:
- Takes the proof and image ID as input
- Verifies that the guest program was executed correctly
- Is compiled to WebAssembly for in-browser verification
- Exposes the `verify_proof` function to JavaScript

The [verifier library](src/lib.rs) contains one function: `verify_proof`.

`verify_proof`:
- takes two `u8` arrays as input; `proof_bytes` and `image_id_bytes`.
- using `risc0_zkvm::Receipt`, the [Receipt](https://docs.rs/risc0-zkvm/latest/risc0_zkvm/struct.Receipt.html) struct is built from `proof_bytes`.
- using `risc0_zkvm::sha::Digest`, the [image_id](https://dev.risczero.com/terminology#image-id) digest is built from `image_id_bytes`.
- the receipt is verified using [receipt.verify](https://docs.rs/risc0-zkvm/latest/risc0_zkvm/struct.Receipt.html#method.verify).
- the output is logged to the console using [web_sys](https://rustwasm.github.io/wasm-bindgen/web-sys/using-web-sys.html).

#### Building the Verifier

To compile the verifier library to WebAssembly:

```bash
cd rust/verifier
wasm-pack build --release --target web --out-dir ../../web/public/wasm/pkg
```

The output is in the `wasm/pkg/` directory in the public folder for the web app.

## Web Application

The `web/` directory contains a Next.js application that demonstrates in-browser proof verification:

- Loads the WebAssembly verifier module
- Fetches the proof and image ID from binary files
- Provides UI for triggering proof verification
- Displays verification results to the user
- Offers comparison between direct calculation and proof verification

The web interface allows users to:
1. Calculate the 1000000th Fibonacci number directly in the browser
2. Verify a pre-generated proof of the calculation
3. Compare the performance difference between direct calculation and verification


