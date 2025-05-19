# R0VM Browser Verifier

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

