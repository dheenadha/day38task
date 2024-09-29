const express = require('express')
const  { createRoom, customerBookingDetails, getAllBookedRoomDetails, getAllCustomersWithRoomDetails, getAllRoomDetails, pageNotFound, roomBooking,  TestServer } = require('./HallBooking');
const router = new express.Router;

router.get('/', TestServer);
router.post('/createRoom', createRoom);
router.get('/allRooms', getAllRoomDetails);
router.post('/roomBooking', roomBooking);
router.get('/allBookedRoomDetails', getAllBookedRoomDetails);
router.get('/allCustomersWithRoomDetails', getAllCustomersWithRoomDetails);
router.get('/customerBookingDetails/:customer_name', customerBookingDetails);
router.get('*', pageNotFound)

module.exports = router;