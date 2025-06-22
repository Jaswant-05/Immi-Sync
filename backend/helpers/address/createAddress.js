const createAddress = ({
    consultancy_id,
    addressString,
    longitude,
    latitude
  }) => ({
    consultancy: consultancy_id,
    address: addressString,
    longitude,
    latitude
  });
  
  module.exports = createAddress;
  