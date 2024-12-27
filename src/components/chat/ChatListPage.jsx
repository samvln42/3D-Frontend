import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatListPage = () => {
  const [chatRooms, setChatRooms] = useState([]);

//   console.log(chatRooms)

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get('/store/list');
      setChatRooms(response.data);

    console.log(chatRooms)

    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  return (
    <div>
      <h1>Chat Rooms</h1>
      <ul>
        {/* {chatRooms.map(chatRoom => (
          <li key={chatRoom.id}>{chatRoom.store_name}</li>
        ))} */}
      </ul>
    </div>
  );
};

export default ChatListPage;
