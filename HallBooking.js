const {format} = require('date-fns')

let bookingRoom = [];
let rooms = [
    {
        roomID : 1,
        roomNo : 101,
        roomName : 'Non-Ac Room',
        roomBookingDates : [],
        amenities : 'Fan,Bed,Hot Water,Television',
        seats : 2,
        price : 1000
    },
    {
        roomID : 2,
        roomNo : 102,
        roomName : 'AC Room',
        roomBookingDates : [],
        amenities : 'AC,Bed,Hot Water,Television',
        seats : 2,
        price : 1500
    },
    {
        roomID : 3,
        roomNo : 103,
        roomName : 'Suite Room',
        roomBookingDates : [],
        amenities : 'AC,Double Bed,Hot Water,Television,Garden View',
        seats : 4,
        price : 2500
    },
    {
        roomID : 4,
        roomNo : 104,
        roomName : 'Premium Room',
        roomBookingDates : [],
        amenities : 'AC,Double Bed,Hot Water,Television,Garden View,Private Pool',
        seats : 4,
        price : 2500
    }
];
//server running
const TestServer = (req, res)=>{
    res.status(200).json({message : "Test Success"});
}

//Creating a room
const createRoom =  (req, res)=>{
    try{
        const {roomNo, roomName, amenities, seats, price} = req.body;

        let i = rooms.findIndex(room=> room.roomNo === roomNo);
        if(i!== -1){
            return res.status(404).json({message : "RoomNo already exists,Try different one"});
        }

        let addRoom = {
            ...(req.body),
            roomID : rooms.length+1,
            roomBookingDates : [],
        }
 
        rooms.push(addRoom);
         res.status(201).json({message :"Room Created Successfully", data :addRoom});

    }catch(err){

        res.status(500).json({
            message : "Server Error"
        })
        console.log(err);
    }
    
}

//Getting all room details
const getAllRoomDetails =  (req, res)=>{
    try{

        if(rooms.length === 0){
            return res.status(404).json({ message: "No Rooms" });
        }
         res.status(200).json({message : "Success", allRooms: rooms});

    }catch(err){

        res.status(500).json({
            message : "Server Error"
        })
        console.log(err);
    }
    
}

//Booking a room if available
const roomBooking = (req, res) => {
    try {

        const { customer_name, date, start_time, end_time, roomID } = req.body;

        let dateTime = new Date();
        let today = format(dateTime, 'yyyy-MM-dd');

        const roomIndex = rooms.findIndex(room => room.roomID === roomID);
        if (roomIndex === -1) {
            return res.status(404).json({ message: "Room Not Found" });
        }
        let room = rooms[roomIndex];
        let isBooked = room.roomBookingDates.some(bookedDate => bookedDate === date);
        if (isBooked) {
            return res.status(400).json({ message: `Room number ${room.roomNo} has already booked for ${date}` });
        }

        if (date < today) {
            return res.status(400).json({ message: "Invalid Date, please enter valid date" });
        }

        //checking if the room is filled
        let checkRoom = bookingRoom.some(e=> e.date === date && e.roomID === roomID);
        if(checkRoom){
            return res.status(404).json({ message: `Room has already filled for this  date` });
        }

        let bookedRoom = {
            ...(req.body),
            booking_status : "Booked",
            booking_date : today,
            booking_id : bookingRoom.length+1
        }
        bookingRoom.push(bookedRoom);
        room.roomBookingDates.push(date);

        res.status(200).json({ message: `Room ${room.roomNo} booked successfully`, roomBookedDetails : {roomName: room.roomName, ...bookedRoom} });

    } catch (err) {

        res.status(500).json({
            message: "Server Error"
        });
        console.log(err);
    }
}

//Getting booked room details
const getAllBookedRoomDetails = (req, res)=>{
    try{

        if(bookingRoom.length === 0){
            return res.status(404).json({ message: "Rooms not yet booked" });
        }

        let bookedRoomInfo = bookingRoom.map(booking=>{
            let room = rooms.find(e=> e.roomID === booking.roomID)
            return {
                roomName : room.roomName,
                booked_status : booking.booking_status,
                customer_name : booking.customer_name,
                date : booking.date,
                start_time : booking.start_time,
                end_time : booking.end_time
            }
        });

        res.status(200).json({message : `Data Fetched Suceesfully`, allBookedRooms: bookedRoomInfo});

   }catch(err){

       res.status(500).json({
           message : "Server Error"
       })
       console.log(err);
   }
} 

//Getting all customer with room data
const getAllCustomersWithRoomDetails = (req, res)=>{
    try{

        if(bookingRoom.length === 0){
            return res.status(404).json({ message: "No data available"});
        }

            let customerDetails = bookingRoom.map(booking=>{
            let room = rooms.find(e=> e.roomID === booking.roomID)
            return {
                customer_name : booking.customer_name,
                roomName : room.roomName,
                date : booking.date,
                start_time : booking.start_time,
                end_time : booking.end_time
            }
        });

        res.status(200).json({message : `Data Fetched Suceesfully`, BookedRoomsCustomerDetails: customerDetails});
    }catch(err){

        //throw error if anything goes wrong
        res.status(500).json({
            message : "Server Error"
        })
        console.log(err);
    }
}


const customerBookingDetails = (req, res)=>{
    try{

        const { customer_name } = req.params;

        let detailsCustomer = bookingRoom.filter(bookedRoom => bookedRoom.customer_name === customer_name);

        if(detailsCustomer.length === 0){
            return res.status(404).json({
                message : `There is no booked room details to show, for the given customer name : ${customer_name}`
            })
         }  

        detailsCustomer = detailsCustomer.map(booking => {
            let room = rooms.find(room => room.roomID === booking.roomID);
            booking.roomName = room.roomName;
            return booking; 
        });

        let resCustomer = {
            customer_name : customer_name,
            booking_count: detailsCustomer.length,
            roomInfo : detailsCustomer.map(e => ({
                roomName: e.roomName,
                date: e.date,
                start_time: e.start_time,
                end_time: e.end_time,
                booking_id: e.booking_id,
                booking_date: e.booking_date,
                booking_status: e.booking_status
            }))
        };

         res.status(200).json({message : `Data Fetched Suceesfully`, data : resCustomer});

    }catch(err){

        res.status(500).json({
            message : `Internal Server Error!`
        })
        console.log(err);
    }
    
}   

//Page Not Found 
const pageNotFound = (req, res)=>{
    res.status(404).json({message : "Page not found"});
}

module.exports = {TestServer,createRoom,roomBooking,getAllRoomDetails,getAllBookedRoomDetails,getAllCustomersWithRoomDetails,customerBookingDetails,pageNotFound}