import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import moment from "moment";
import { QueryMeetingChat, getFAQByMeetingId } from "../../services/projectService";
import { FaArrowUp } from "react-icons/fa";
import { NoRecordsFound } from "../../components/Common/NoRecordFound/NoRecordsFound";
import { TextParagraph } from "../../components/Common/TextParagraph";
import { MdSend } from "react-icons/md";
import Scrollbars from "react-custom-scrollbars-2";

export const QueryMeeting = ({ queryMeeting, meetingId, meetingDetails }) => {
  const [text, setText] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const discussionEndRef = useRef(null);

  const fetchData = async () => {
    if (!meetingId) {
      return;
    }
    const response = await getFAQByMeetingId(meetingId);
    if (response.status) {
      const faqs = response.data.flatMap((faq, index) => [
        {
          user: "Pranjal on 15 Apr",
          text: faq.question,
          side: index % 2 === 0 ? "left" : "right",
          time: moment(faq?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          user: "AI",
          text: faq.answer_text,
          side: index % 2 === 0 ? "right" : "left",
          time: moment(faq?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        },
      ]);
      setDiscussions(faqs);
    } else {
      console.error("No data received");
    }
  };

  useEffect(() => {
    fetchData();
  }, [meetingId]);
  useEffect(() => {
    if (discussionEndRef.current) {
      discussionEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [discussions]);

  const onChange = (e) => {
    setText(e.target.value);
  };

  const chartbot = async (text) => {
    const prompt = { prompt: text };

    const data = await QueryMeetingChat(meetingId, prompt);
    if (data?.status) {
      setText("");
      setLoading(false);
      return data?.textValue;
    } else {
      setLoading(false);
      setText("");
      return "Sorry, there was an issue processing your request.";
    }
  };

  const handleAskClick = async () => {
    if (!text) return;
    const newDiscussion = {
      user: "Pranjal on 15 Apr",
      text,
      side: "left",
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    setDiscussions((prevDiscussions) => [...prevDiscussions, newDiscussion]);
    setLoading(true);
    const aiResponseText = await chartbot(text);
    const aiResponse = {
      user: "AI",
      text: aiResponseText,
      side: "right",
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    setDiscussions((prevDiscussions) => [...prevDiscussions, aiResponse]);
  };

  return (
     <>
      <Row>
        <Col>
          <div className="discussionWrapper">
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={315}
              autoHide
            >
            {discussions.length ? (
              <>
                {discussions.map((discussion, index) => (
                  <DiscussionItem key={index} discussion={discussion} />
                ))}
                {loading && (
                  <div className="loading-spinner">
                    <div className="wave-container">
                      <div className="wave-line"></div>
                      <div className="wave-line"></div>
                      <div className="wave-line"></div>
                      <div className="wave-line"></div>
                      <div className="wave-line"></div>
                      <div className="wave-line"></div>
                    </div>
                    <div className="loading-text">Generating response...</div>
                  </div>
                )}
                <div ref={discussionEndRef} />
              </>
            ) : (
              <NoRecordsFound
                message={
                  meetingDetails?.assistant_id === null &&
                  meetingDetails?.thread_id === null
                    ? "The Video is not Transcribed Yet."
                    : "No Record Found"
                }
              />
            )}
            </Scrollbars>
          </div>          
        </Col>
      </Row>
      <Row className="mb-0">
        {meetingDetails?.assistant_id !== null &&
          !meetingDetails?.thread_id !== null && (
            <Col>
              <ChatInput
                value={text}
                placeholder="Enter your query here..."
                onChange={onChange}
                borderShadow
                handleAskClick={handleAskClick}
                maxLength={100} // Set your desired max length here
              />
            </Col>
          )}
      </Row>
      </>
  );
};

const DiscussionItem = ({ discussion }) => (
  <div
    className={`discussion-item ${discussion?.side}-side ${
      discussion.user === "AI" ? "ai-response" : "user-query"
    }`}
    style={{ position: "relative" }}
  >
    <TextParagraph text={discussion.text} />
    <small className="chatMsgDate">
      {discussion.time}
    </small>
  </div>
);
const ChatInput = ({
  value,
  placeholder = "Enter your query here...",
  edit = false,
  onChange,
  borderShadow = false,
  handleAskClick,
}) => {
  const [error, setError] = useState("");
  const maxLength = 200;
  const isValueValid = value.trim().length > 1;
  const remainingChars = value.length;

  useEffect(() => {
    if (value.length > maxLength) {
      setError("Input value cannot exceed 200 characters.");
    } else {
      setError("");
    }
  }, [value]);

  return (
    <InputGroup
      className="chat-input-container"
      style={{
        boxShadow: borderShadow ? "0px 4px 12px rgba(0, 0, 0, 0.1)" : "none",
      }}
    >
      <div className="chat-input-wrapper">
        <FormControl
          value={value}
          as="textarea"
          placeholder={placeholder}
          aria-label="Message"
          onChange={onChange}
          readOnly={edit}
          className="chat-input-textarea"
          maxLength={maxLength}
        />
        <div className="total-count-overlay">
          {remainingChars}/{maxLength}
        </div>
        {error && <div className="error-message danger">{error}</div>}
      </div>
      <Button
        variant="light"
       // className="chat-input-button"
        className={`chat-input-button ${isValueValid ? "active" : "inactive"}`}
        onClick={handleAskClick}
        disabled={!isValueValid}
        aria-disabled={!isValueValid}
      ><MdSend /></Button>
    </InputGroup>
  );
};
