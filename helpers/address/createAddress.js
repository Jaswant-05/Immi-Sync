const createAddress = ({
    consultancy_id,
    address1,
    address2,
    city,
    state,
    postal_code,
    country
  }) => ({
    consultancy: consultancy_id,
    address1,
    address2: address2 || null,
    city,
    state,
    postal_code,
    country,
  });
  
  module.exports = createAddress;
  