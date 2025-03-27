const createAddress = (params) => {
    const {consultancy_id , address1, address2 , city, state, postal_code, country} = params;

    const addressPayload = {
        consultancy : consultancy_id,
        address1,
        address2 : address2 || null,
        city,
        state,
        postal_code,
        country,
    };

    return(addressPayload);

};

module.exports = createAddress


/**
 control flow according to me right now -->
    user signs-up
    then either user chooses a already existing consultancy incase user is a client or user creates a new consultancy incase it is a consultancy that is registering
    in the later case the flow would be -->
        enter consultancy information then enter address and then add create the consultancy with the address and assign that to the user 
 */