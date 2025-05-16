use getrandom::register_custom_getrandom;

fn custom_getrandom(buf: &mut [u8]) -> Result<(), getrandom::Error> {
    // For BPF target, we'll use a simple deterministic implementation
    // This is just for demonstration - in production you might want a more sophisticated approach
    for (i, byte) in buf.iter_mut().enumerate() {
        *byte = (i % 256) as u8;
    }
    Ok(())
}

register_custom_getrandom!(custom_getrandom); 