import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetMeeting, selectMeeting } from "../meeting/meetingSlice";
import { useParams } from "react-router-dom";
import MeetingHeader from "../components/MeetingHeader";
import Attendees from "../components/Attendees";
import StopMeetingModal from "../components/StopMeetingModal";
import axios from "axios";

const MeetingPage = () => {
  const dispatch = useDispatch();
  const meeting = useSelector(selectMeeting);
  const params = useParams();
  const [isStarted, setIsStarted] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [showStopModal, setShowStopModal] = useState(false);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordingRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    recordingRef.current = isStarted;
  }, [isStarted]);

  useEffect(() => {
    dispatch(GetMeeting(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const startNewChunk = async () => {
        if (!streamRef.current || !recordingRef.current) return;

        const mediaRecorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const result = await sendAudioToGroq(event.data);
            if (result && result.text) {
              const formattedTranscription = result.text;
              setTranscription((prev) =>
                prev ? `${prev}\n${formattedTranscription}` : formattedTranscription
              );
            }
          }
        };

        mediaRecorder.onstop = () => {
          if (recordingRef.current) {
            timeoutRef.current = setTimeout(startNewChunk, 0);
          } else {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        };

        mediaRecorder.start();
        timeoutRef.current = setTimeout(() => mediaRecorder.stop(), 5000);
      };

      startNewChunk();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    recordingRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const sendAudioToGroq = async (blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/transcribe`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;
      console.log("Transcription:", result.text);

      return result;
    } catch (error) {
      console.error("Error sending audio to backend:", error);
      return null;
    }
  };

  const handleStartMeeting = () => {
    setIsStarted(true);
    startRecording();
    console.log("Meeting started");
  };

  const handleStopMeeting = () => {
    setShowStopModal(true);
  };

  const confirmStopMeeting = () => {
    setIsStarted(false);
    setShowStopModal(false);
    setIsMeetingEnded(true);
    stopRecording();
    console.log("Meeting stopped");
  };

  const handleSaveMeeting = () => {
    console.log("Meeting saved with transcription:", transcription);
  };

  if (!meeting) {
    return <div className="flex justify-center items-center h-screen">Loading meeting details...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <MeetingHeader meeting={meeting} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Controls and Transcription */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Meeting Controls</h2>

            {!isMeetingEnded && (
              !isStarted ? (
                <button
                  onClick={handleStartMeeting}
                  className="bg-black hover:opacity-75 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start Meeting
                </button>
              ) : (
                <button
                  onClick={handleStopMeeting}
                  className="bg-black hover:opacity-75 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  Stop Meeting
                </button>
              )
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Live Transcription</h3>
            <div className="border rounded-md p-4 bg-gray-50 h-64 overflow-y-auto">
              {isStarted ? (
                transcription ? (
                  <p className="text-gray-700 whitespace-pre-line">{transcription}</p>
                ) : (
                  <p className="text-gray-500 italic">Transcription will appear here...</p>
                )
              ) : (
                <p className="text-gray-500 italic">Start the meeting to begin transcription.</p>
              )}
            </div>
          </div>

          {!isStarted && transcription && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveMeeting}
                className="bg-black hover:opacity-75 text-white font-medium py-2 px-4 rounded-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293z" />
                </svg>
                Save Meeting
              </button>
            </div>
          )}
        </div>

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
