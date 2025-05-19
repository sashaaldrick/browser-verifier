use risc0_zkvm::guest::env;

fn main() {
    // read the input
    let input: u32 = env::read();

    // create Fibonacci array with length denoted by input
    let mut seq: Vec<i32> = vec![0; (input + 1) as usize];
    seq[0] = 0;
    seq[1] = 1;

    for i in 2..=input as usize {
        seq[i] = seq[i-2] + seq[i-1]
    }

    println!("Fibonacci Array = {:#?}", seq);

    // write F_input to the journal
    env::commit(&seq[input as usize]);
}
