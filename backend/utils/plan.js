const plans = {
    basic : {
        name: 'Basic Plan',
        user_limit : 1,
        application_limit : 5,
        product_id : "prod_SoBxkGpcmLHWdD",
        price_id : {
            monthly : "price_1RsZZKAYidf743U1mFHNKsGE",
            yearly : "price_1RsZaJAYidf743U1OLbsH1g8"
        }
    },
    standard : {
        name: 'Standard Plan',
        user_limit : 5,
        application_limit : null,
        product_id : "prod_SoBy598wj9yubX",
        price_id : {
            monthly : "price_1RsZazAYidf743U1OXab9Nzw",
            yearly : "price_1RsZazAYidf743U13fWg48p1"
        }
    },
    plus : {
        name: 'Plus Plan',
        user_limit : 20,
        application_limit : null,
        product_id : "prod_SoBzrkpiTLkErR",
        price_id : {
            monthly : "price_1RsZbRAYidf743U10zMm9Iik",
            yearly : "price_1RsZcjAYidf743U1a2bdtrRV"
        }
    }
}

module.exports = plans