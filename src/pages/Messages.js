import { useEffect, useState } from "react";
import { FaEnvelope, FaReply, FaTrash, FaInbox } from "react-icons/fa";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/messages")
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error("Error fetching messages: ", error);
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReplyClick = (msg) => {
    setSelectedMessage(msg);
    setReplyMessage("");
  };

  const handleDeleteMessage = (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    fetch(`http://localhost:5000/messages/${id}`, { method: "DELETE" })
      .then(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      })
      .catch((error) => console.error("Error deleting message: ", error));
  };

  const handleSendReply = (id) => {
    if (!selectedMessage) return;

    const updateMessage = {
      ...selectedMessage,
      status: "Replied",
      // reply text kept locally for later real API
      adminReply: replyMessage,
    };

    fetch(`http://localhost:5000/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateMessage),
    })
      .then(() => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? updateMessage : msg))
        );
        setReplyMessage("");
        setSelectedMessage(null);
      })
      .catch((error) => console.error("Error sending reply:", error));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <FaEnvelope className="text-[#ff7a00]" />
          Messages
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customer contact messages — UI preview (API will be connected later)
        </p>
      </div>

      {/* Reply panel */}
      {selectedMessage && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Reply to{" "}
            <span className="text-[#ff7a00]">{selectedMessage.name}</span>
          </h2>
          <p className="text-sm text-slate-500 mb-3">{selectedMessage.email}</p>
          <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
            {selectedMessage.message}
          </p>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-[#ff7a00] min-h-[100px]"
            placeholder="Write your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              onClick={() => handleSendReply(selectedMessage.id)}
              className="bg-[#ff7a00] hover:bg-[#e56e00] text-white font-semibold px-4 py-2.5 rounded-xl text-sm"
            >
              Send reply
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedMessage(null);
                setReplyMessage("");
              }}
              className="border border-slate-200 text-slate-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center py-16 text-slate-400">Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FaInbox className="text-3xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium mb-1">No messages yet</p>
            <p className="text-sm text-slate-400">
              Connect Spring Boot messages API later to load real data.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => {
                  const replied =
                    msg.status === "Replied" ||
                    msg.status === "پاسخ داده شده";
                  return (
                    <tr key={msg.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {msg.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{msg.email}</td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                        {msg.message}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {msg.date}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            replied
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {replied ? "Replied" : msg.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleReplyClick(msg)}
                            className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            <FaReply /> Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;