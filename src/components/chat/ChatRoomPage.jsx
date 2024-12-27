import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatRoomPage = () => {
  const { storeId } = useParams();
  const [chatRoomData, setChatRoomData] = useState(null);

  useEffect(() => {
    fetchChatRoomData();
  }, [storeId]);

  const fetchChatRoomData = async () => {
    try {
      const response = await axios.get(`/list/${storeId}`);
      setChatRoomData(response.data);
    } catch (error) {
      console.error('Error fetching chat room data:', error);
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      {chatRoomData && (
        <div>
          <p>Store Name: {chatRoomData.store_name}</p>
          <p>User Name: {chatRoomData.user_name}</p>
          {/* Render other chat room details here */}
        </div>
      )}
    </div>
  );
};

export default ChatRoomPage;
