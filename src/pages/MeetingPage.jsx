import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetMeeting, selectMeeting, ChangeMeetingStatus } from "../meeting/meetingSlice";
import { useParams, useNavigate } from "react-router-dom";
import MeetingHeader from "../components/MeetingHeader";
import Attendees from "../components/Attendees";
import StopMeetingModal from "../components/StopMeetingModal";
import axios from "axios";
import { selectLoggedinUser } from "../auth/authSlice";

const MeetingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const meeting = useSelector(selectMeeting);
  const params = useParams();
  const [isStarted, setIsStarted] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [agentMessages, setAgentMessages] = useState([]);
  const [showStopModal, setShowStopModal] = useState(false);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false);
  const [transcriptionCount, setTranscriptionCount] = useState(0);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordingRef = useRef(false);
  const timeoutRef = useRef(null);
  const agentIntervalRef = useRef(null);
  const transcriptionRef = useRef(""); // Ref to track latest transcription
  const user = useSelector(selectLoggedinUser);

  // Sync transcriptionRef with transcription state
  useEffect(() => {
    transcriptionRef.current = transcription;
    console.log("Updated transcriptionRef:", transcriptionRef.current);
  }, [transcription]);

  useEffect(() => {
    recordingRef.current = isStarted;
  }, [isStarted]);

  useEffect(() => {
    dispatch(GetMeeting(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (meeting && meeting.status === "in progress") {
      setIsStarted(true);
    }
    if (meeting && meeting.status === "done") {
      setIsMeetingEnded(true);
    }
    console.log("Meeting state:", meeting);
  }, [meeting]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isStarted && !isMeetingEnded) {
        event.preventDefault();
        event.returnValue = "";
        confirmStopMeeting();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopRecording();
      if (agentIntervalRef.current) {
        clearInterval(agentIntervalRef.current);
      }
    };
  }, [isStarted, isMeetingEnded]);

  const startRecording = async () => {
    console.log("Starting recording...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      console.log("Media stream acquired");

      const startNewChunk = async () => {
        if (!streamRef.current || !recordingRef.current) {
          console.log("Stopping chunk due to no stream or recording stopped");
          return;
        }

        const mediaRecorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            console.log("Audio data available, sending to Groq...");
            const result = await sendAudioToGroq(event.data);
            if (result && result.text) {
              const formattedTranscription = result.text;
              console.log("New transcription chunk:", formattedTranscription);
              setTranscription((prev) => {
                const newTranscription = prev ? `${prev}\n${formattedTranscription}` : formattedTranscription;
                console.log("Updated transcription:", newTranscription);
                return newTranscription;
              });
              setTranscriptionCount((prev) => {
                const newCount = prev + 1;
                console.log("Transcription count:", newCount);
                return newCount;
              });
            } else {
              console.warn("No transcription text received");
            }
          }
        };

        mediaRecorder.onstop = () => {
          if (recordingRef.current) {
            console.log("Starting new recording chunk");
            timeoutRef.current = setTimeout(startNewChunk, 0);
          } else {
            console.log("Stopping recording, clearing stream");
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        };

        console.log("Starting media recorder");
        mediaRecorder.start();
        timeoutRef.current = setTimeout(() => {
          console.log("Stopping media recorder after 5 seconds");
          mediaRecorder.stop();
        }, 5000);
      };

      startNewChunk();

      console.log("Setting up agent analysis interval");
      agentIntervalRef.current = setInterval(() => {
        console.log("Agent interval triggered");
        analyzeTranscription();
      }, 10000);
    } catch (error) {
      console.error("Error in startRecording:", error);
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    recordingRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      console.log("Cleared timeout");
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      console.log("Stopped media recorder");
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      console.log("Stopped media stream");
    }

    if (agentIntervalRef.current) {
      clearInterval(agentIntervalRef.current);
      agentIntervalRef.current = null;
      console.log("Cleared agent interval");
    }
  };

  const sendAudioToGroq = async (blob) => {
    console.log("Sending audio to Groq...");
    try {
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/transcribe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Transcription response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending audio to backend:", error);
      return null;
    }
  };

  const analyzeTranscription = async () => {
    const currentTranscription = transcriptionRef.current;
    console.log("Analyzing transcription...", { currentTranscription, transcriptionCount });
    if (!currentTranscription) {
      console.log("No transcription available, skipping analysis");
      return;
    }

    try {
      console.log("Sending transcription to analyze endpoint...");
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/meeting/${params.id}/analyze`,
        { transcription: currentTranscription }
      );

      console.log("Analyze response:", response.data);
      const result = response.data.result;
      if (result !== '<Keep Going>') {
        const violationType = result.toLowerCase().includes('decorum') ? 'decorum' : 'agenda';
        setAgentMessages((prev) => [
          ...prev,
          { text: result, type: violationType, timestamp: new Date().toLocaleTimeString() },
        ]);
        console.log("Added agent message:", result);
      } else {
        console.log("Agent response: <Keep Going>, no message added");
      }
      setTranscriptionCount(0);
      console.log("Reset transcription count");
    } catch (error) {
      console.error("Error analyzing transcription:", error);
    }
  };

  const saveTranscription = async () => {
    console.log("Saving transcription...");
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/meeting/${params.id}/transcription`,
        { transcription: transcriptionRef.current }
      );
      console.log("Transcription saved successfully");
    } catch (error) {
      console.error("Error saving transcription:", error);
    }
  };

  const handleStartMeeting = async () => {
    console.log("Starting meeting...");
    setIsStarted(true);
    await dispatch(ChangeMeetingStatus({ id: params.id, status: "in progress" }));
    startRecording();
    console.log("Meeting started");
  };

  const confirmStopMeeting = async () => {
    console.log("Confirming stop meeting...");
    setIsStarted(false);
    setShowStopModal(false);
    setIsMeetingEnded(true);
    stopRecording();
    await saveTranscription();
    await dispatch(ChangeMeetingStatus({ id: params.id, status: "done" }));
    console.log("Meeting stopped");
    navigate(-1);
  };

  const handleStopMeeting = () => {
    console.log("Opening stop meeting modal...");
    setShowStopModal(true);
  };

  const handleSaveMeeting = () => {
    console.log("Meeting saved with transcription:", transcriptionRef.current);
  };

  if (!meeting) {
    return <div className="flex justify-center items-center h-screen">Loading meeting details...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <MeetingHeader meeting={meeting} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {meeting.organizer && user.user.id === meeting.organizer._id && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Meeting Controls</h2>

              {!isMeetingEnded && (
                !isStarted ? (
                  <button
                    onClick={handleStartMeeting}
                    className="bg-black hover:opacity-75 text-white font-medium py-2 px-4 rounded-md flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Start Meeting
                  </button>
                ) : (
                  <button
                    onClick={handleStopMeeting}
                    className="bg-black hover:opacity-75 text-white font-medium py-2 px-4 rounded-md flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Stop Meeting
                  </button>
                )
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Live Transcription</h3>
              <div className="border rounded-md p-4 bg-gray-50 h-64 overflow-y-auto">
                {!meeting.transcription && meeting.status !== "done" && (
                  <>
                    {isStarted ? (
                      transcription ? (
                        <p className="text-gray-700 whitespace-pre-line">{transcription}</p>
                      ) : (
                        <p className="text-gray-500 italic">Transcription will appear here...</p>
                      )
                    ) : (
                      <p className="text-gray-500 italic">Start the meeting to begin transcription.</p>
                    )}
                  </>
                )}
                {meeting.transcription && meeting.status === "done" && (
                  <p className="text-gray-500 italic">{meeting.transcription}</p>
                )}
              </div>
            </div>
             {meeting.status !== "done"&&
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-2">Agent Monitoring</h3>
              <div className="border rounded-md p-4 bg-gray-50 h-64 overflow-y-auto">
                {agentMessages.length > 0 ? (
                  agentMessages.map((msg, index) => (
                    <p
                      key={index}
                      className={`mb-2 ${
                        msg.type === 'decorum' ? 'text-red-600' : 'text-blue-600'
                      }`}
                    >
                      <span className="font-semibold">[{msg.timestamp}] Agent: </span>
                      {msg.text}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Agent messages will appear here...</p>
                )}
              </div>
            </div>}
          </div>
        )}
        <Attendees attendees={meeting.attendees} />
      </div>

      <StopMeetingModal
        show={showStopModal}
        onCancel={() => setShowStopModal(false)}
        onConfirm={confirmStopMeeting}
      />
    </div>
  );
};

export default MeetingPage;