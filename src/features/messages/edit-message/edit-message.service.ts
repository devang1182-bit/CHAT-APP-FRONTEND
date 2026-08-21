import axios from "axios";

const EditMessageService = async ({
  messageId,
  text,
}: {
  messageId: string;
  text: string;
}) => {
  const response = await axios.get(
    `/api/edit-message?messageId=${messageId}&&text=${text}`,
  );
  return response.data;
};

export default EditMessageService;
