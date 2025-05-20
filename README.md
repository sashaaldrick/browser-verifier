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

## Rust Components

The `rust/` directory contains the zero-knowledge proof system components:

### guest/

The guest code contains the program that runs inside the R0VM (RISC Zero Virtual Machine). This is the computation that gets proven. In this project, it calculates the 1000000th Fibonacci number and commits the length of that number to the journal.

### host/

The host code is responsible for:
- Loading and executing the guest program in the R0VM
- Generating proofs of correct execution
- Serializing the proofs into binary files that can be used by the verifier

### verifier/

The verifier is a Rust library that:
- Takes the proof and image ID as input
- Verifies that the guest program was executed correctly
- Is compiled to WebAssembly for in-browser verification
- Exposes the `verify_proof` function to JavaScript

#### Building the Verifier

To compile the verifier library to WebAssembly:

```bash
cd rust/verifier
wasm-pack build --release --target web
```

The output is in the `pkg/` directory.

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

### Running the Web App

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

This repo contains the library "verifier", with one file [lib.rs](src/lib.rs). It also contains one simple [index.html](./index.html). 

It has two important `.bin` files; `image_data_STARK.bin` and `image_id.bin`. These contain:

- a `Receipt` which is serialized in some R0VM host code (TODO: import host code). This `Receipt` contains the proof of guest code execution (TODO: import guest code).
- the Image ID of the guest program.

TODO: explain basic fibonacci guest code.

## lib.rs

[lib.rs](src/lib.rs) contains one function: `verify_proof`.

`verify_proof`:
- takes two `u8` arrays as input; `proof_bytes` and `image_id_bytes`.
- using `risc0_zkvm::Receipt`, the [Receipt](https://docs.rs/risc0-zkvm/latest/risc0_zkvm/struct.Receipt.html) struct is built from `proof_bytes`.
- using `risc0_zkvm::sha::Digest`, the [image_id](https://dev.risczero.com/terminology#image-id) digest is built from `image_id_bytes`.
- the receipt is verified using [receipt.verify](https://docs.rs/risc0-zkvm/latest/risc0_zkvm/struct.Receipt.html#method.verify).
- the output is logged to the console using [web_sys](https://rustwasm.github.io/wasm-bindgen/web-sys/using-web-sys.html).

## wasm-pack build

To compile the verifier library to wasm i.e. some JS code that a browser can run:

`wasm-pack build --release --target web`

The output is in `/pkg/`. The actually proof verification code lives in [pkg/verifier.js](./pkg/verifier.js).

For more information, see [Building without a bundler](https://rustwasm.github.io/wasm-bindgen/examples/without-a-bundler.html).

## index.html

[index.html](./index.html):

- loads the WASM module.
- fetches the proof and image ID bytes and stores them in `Uint8Array`.
- calls the JS `verify_proof` in the `wasm-pack` built code [pkg/verifier.js](./pkg/verifier.js)

