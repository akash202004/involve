module booking::booking {

    struct Booking has key {
        id: u64,
        user: address,
        worker: address,
        timestamp: u64,
    }

    public entry fun add_booking(
        account: &signer,
        id: u64,
        user: address,
        worker: address,
        time: u64
    ) {
        let b = Booking { id, user, worker, timestamp: time };
        move_to(account, b);
    }
}
