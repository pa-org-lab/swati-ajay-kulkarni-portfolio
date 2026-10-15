"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiClock,
  FiEye,
  FiMail,
  FiMessageSquare,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import {
  type ContactItemData,
  type ContactStats,
  deleteContactAction,
  getContactsAction,
  updateContactStatusAction,
} from "@/backend/actions/contact.action";
import ConfirmationModal from "@/frontend/components/admin/common/ConfirmationModal";
import MessageDetailModal from "./MessageDetailModal";
import ReplyMessageModal from "./ReplyMessageModal";

export default function AdminMessagesSection() {
  const [contacts, setContacts] = useState<ContactItemData[]>([]);
  const [stats, setStats] = useState<ContactStats>({
    total: 0,
    unread: 0,
    today: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [selectedContact, setSelectedContact] =
    useState<ContactItemData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [contactToDelete, setContactToDelete] =
    useState<ContactItemData | null>(null);
  const [replyContact, setReplyContact] = useState<ContactItemData | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchContacts = useCallback(
    async (showRefreshIndicator = false) => {
      if (showRefreshIndicator) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const res = await getContactsAction({
          page: currentPage,
          limit: 20,
          status: activeTab === "all" ? undefined : activeTab,
          search: searchQuery,
        });

        if (res.success && res.contacts) {
          setContacts(res.contacts);
          if (res.stats) {
            setStats(res.stats);
          }
          if (res.pagination) {
            setTotalPages(res.pagination.totalPages);
          }
        } else {
          toast.error(res.error || "Failed to load messages");
        }
      } catch (err: unknown) {
        console.error("Error fetching messages:", err);
        toast.error("Network error while loading messages");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentPage, activeTab, searchQuery],
  );

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Open Message details & auto mark as read
  const handleOpenDetail = async (contact: ContactItemData) => {
    setSelectedContact(contact);
    setIsDetailOpen(true);

    if (contact.status === "unread") {
      try {
        await updateContactStatusAction(contact._id, "read");
        setContacts((prev) =>
          prev.map((c) =>
            c._id === contact._id ? { ...c, status: "read" } : c,
          ),
        );
        setStats((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
        }));
      } catch (e) {
        console.error("Auto mark read failed:", e);
      }
    }
  };

  // Toggle Read/Unread
  const handleToggleStatus = async (contact: ContactItemData) => {
    const nextStatus = contact.status === "unread" ? "read" : "unread";
    setIsUpdatingStatus(true);
    try {
      const res = await updateContactStatusAction(contact._id, nextStatus);
      if (res.success) {
        setContacts((prev) =>
          prev.map((c) =>
            c._id === contact._id ? { ...c, status: nextStatus } : c,
          ),
        );
        if (selectedContact?._id === contact._id) {
          setSelectedContact((prev) =>
            prev ? { ...prev, status: nextStatus } : null,
          );
        }
        setStats((prev) => ({
          ...prev,
          unread:
            nextStatus === "unread"
              ? prev.unread + 1
              : Math.max(0, prev.unread - 1),
        }));
        toast.success(`Message marked as ${nextStatus}`);
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Delete message confirmation
  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteContactAction(contactToDelete._id);
      if (res.success) {
        toast.success("Message deleted successfully");
        if (selectedContact?._id === contactToDelete._id) {
          setIsDetailOpen(false);
          setSelectedContact(null);
        }
        setContactToDelete(null);
        fetchContacts();
      } else {
        toast.error(res.error || "Failed to delete message");
      }
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-full p-6 sm:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-[34px] font-bold text-[#2b1f18] leading-none tracking-tight">
            Inquiries &amp; Messages
          </h1>
          <p className="mt-2 text-[14px] text-[#a89488] font-normal">
            View and manage contact form submissions from website visitors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchContacts(true)}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#d4cac2] bg-white text-[#6b5a50] text-[13px] font-semibold hover:border-[#a8522e] hover:text-[#a8522e] hover:bg-[#f9f5f3] transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <FiRefreshCw
            className={`text-sm shrink-0 ${isRefreshing ? "animate-spin text-[#a8522e]" : ""}`}
          />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </header>

      {/* Stat Cards - Displays the number of users who filled the form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {/* Total Inquiries */}
        <div className="p-6 rounded-3xl bg-white border border-[#e8dfd8] shadow-[0_4px_20px_rgba(43,31,24,0.04)] flex items-center justify-between">
          <div>
            <p className="text-[11.5px] uppercase font-semibold tracking-wider text-[#a89488]">
              Total Inquiries
            </p>
            <p className="mt-2 text-3xl font-bold text-[#2b1f18]">
              {isLoading ? "—" : stats.total}
            </p>
            <p className="mt-1 text-xs text-[#8e7a6f]">
              Users who filled the contact form
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f8f3f0] text-[#a8522e] flex items-center justify-center text-xl">
            <FiUsers />
          </div>
        </div>

        {/* Unread Inquiries */}
        <div className="p-6 rounded-3xl bg-white border border-[#e8dfd8] shadow-[0_4px_20px_rgba(43,31,24,0.04)] flex items-center justify-between relative overflow-hidden">
          {stats.unread > 0 && (
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-[#c2654d]/10 rounded-full pointer-events-none" />
          )}
          <div>
            <p className="text-[11.5px] uppercase font-semibold tracking-wider text-[#a8522e]">
              Unread Messages
            </p>
            <p className="mt-2 text-3xl font-bold text-[#a8522e]">
              {isLoading ? "—" : stats.unread}
            </p>
            <p className="mt-1 text-xs text-[#8e7a6f]">Awaiting your review</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fbeee8] text-[#a8522e] flex items-center justify-center text-xl border border-[#f2d5c8]">
            <FiMail />
          </div>
        </div>

        {/* Today's Inquiries */}
        <div className="p-6 rounded-3xl bg-white border border-[#e8dfd8] shadow-[0_4px_20px_rgba(43,31,24,0.04)] flex items-center justify-between">
          <div>
            <p className="text-[11.5px] uppercase font-semibold tracking-wider text-[#a89488]">
              Today
            </p>
            <p className="mt-2 text-3xl font-bold text-[#2b1f18]">
              {isLoading ? "—" : stats.today}
            </p>
            <p className="mt-1 text-xs text-[#8e7a6f]">
              Received in the last 24h
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f8f3f0] text-[#2b1f18] flex items-center justify-center text-xl">
            <FiClock />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#e8dfd8] shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f7f2ee] rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-[#2b1f18] shadow-xs"
                : "text-[#8e7a6f] hover:text-[#2b1f18]"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("unread");
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "unread"
                ? "bg-white text-[#a8522e] shadow-xs"
                : "text-[#8e7a6f] hover:text-[#2b1f18]"
            }`}
          >
            Unread ({stats.unread})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("read");
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "read"
                ? "bg-white text-[#2b1f18] shadow-xs"
                : "text-[#8e7a6f] hover:text-[#2b1f18]"
            }`}
          >
            Read ({Math.max(0, stats.total - stats.unread)})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by sender, email, subject..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#faf7f4] border border-[#e8dfd8] text-[#2b1f18] placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a8522e]/20 focus:border-[#a8522e] transition-all"
          />
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="bg-white rounded-3xl border border-[#e8dfd8] shadow-[0_4px_24px_rgba(43,31,24,0.05)] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#a8522e] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#a89488] font-medium tracking-wide">
              Loading inquiries...
            </p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#fbf5f1] text-[#a8522e] flex items-center justify-center text-2xl mx-auto mb-4">
              <FiMessageSquare />
            </div>
            <h3 className="font-serif text-xl text-[#2b1f18] font-normal">
              No Messages Found
            </h3>
            <p className="mt-1.5 text-xs text-[#8e7a6f] max-w-sm mx-auto">
              {searchQuery
                ? `No submissions match "${searchQuery}". Try refining your search.`
                : activeTab === "unread"
                  ? "You have no unread inquiries right now."
                  : "No contact inquiries have been received yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ede4dc] bg-[#faf6f2]/80 text-[11px] font-bold text-[#8e7a6f] uppercase tracking-wider">
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Subject &amp; Snippet</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2ebe5] text-xs">
                {contacts.map((contact) => {
                  const isUnread = contact.status === "unread";
                  const dateStr = new Date(
                    contact.createdAt,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={contact._id}
                      onClick={() => handleOpenDetail(contact)}
                      className={`hover:bg-[#faf7f4] transition-colors cursor-pointer group ${
                        isUnread ? "bg-[#fffaf7]" : "bg-white"
                      }`}
                    >
                      {/* Sender */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-serif text-sm font-semibold ${
                              isUnread
                                ? "bg-[#a8522e] text-white shadow-xs"
                                : "bg-[#ede4dc] text-[#6b5a50]"
                            }`}
                          >
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`font-semibold truncate ${
                                isUnread ? "text-[#2b1f18]" : "text-[#5c4a3f]"
                              }`}
                            >
                              {contact.name}
                            </p>
                            <p className="text-[11px] text-[#8e7a6f] truncate">
                              {contact.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Preview */}
                      <td className="py-4 px-6 max-w-xs sm:max-w-md">
                        <p
                          className={`truncate font-medium ${
                            isUnread
                              ? "text-[#2b1f18] font-bold"
                              : "text-[#4a3c33]"
                          }`}
                        >
                          {contact.subject}
                        </p>
                        <p className="text-[11.5px] text-[#9c8a7e] truncate mt-0.5">
                          {contact.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide uppercase ${
                            isUnread
                              ? "bg-[#fbeee8] text-[#a8522e] border border-[#f2d5c8]"
                              : "bg-[#f0edea] text-[#786658] border border-[#e4ded6]"
                          }`}
                        >
                          {isUnread ? "Unread" : "Read"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 whitespace-nowrap text-[#8e7a6f] text-[11.5px]">
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-4 px-6 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Detail button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(contact)}
                            title="View details"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b5a50] hover:text-[#a8522e] hover:bg-[#f6efe9] transition-colors cursor-pointer"
                          >
                            <FiEye className="text-sm" />
                          </button>

                          {/* Toggle read status */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(contact)}
                            title={isUnread ? "Mark as Read" : "Mark as Unread"}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b5a50] hover:text-[#2b1f18] hover:bg-[#f6efe9] transition-colors cursor-pointer"
                          >
                            <FiCheckCircle
                              className={`text-sm ${
                                isUnread ? "text-stone-400" : "text-emerald-600"
                              }`}
                            />
                          </button>

                          {/* Quick reply */}
                          <button
                            type="button"
                            onClick={() => setReplyContact(contact)}
                            title={`Reply to ${contact.email}`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b5a50] hover:text-[#a8522e] hover:bg-[#f6efe9] transition-colors cursor-pointer"
                          >
                            <FiSend className="text-xs" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setContactToDelete(contact)}
                            title="Delete message"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="text-xs" />
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

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#ede4dc] flex items-center justify-between text-xs text-[#8e7a6f]">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#d8cec5] bg-white text-[#5c4a3f] disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-[#d8cec5] bg-white text-[#5c4a3f] disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <MessageDetailModal
        contact={selectedContact}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedContact(null);
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={(contact) => {
          setContactToDelete(contact);
        }}
        onReply={(contact) => {
          setReplyContact(contact);
        }}
        isUpdating={isUpdatingStatus}
      />

      {/* Reply Composer Modal */}
      <ReplyMessageModal
        contact={replyContact}
        isOpen={Boolean(replyContact)}
        onClose={() => setReplyContact(null)}
        onSuccess={() => {
          setReplyContact(null);
          fetchContacts();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(contactToDelete)}
        onClose={() => setContactToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message={
          contactToDelete ? (
            <span>
              Are you sure you want to permanently delete the inquiry from{" "}
              <strong>{contactToDelete.name}</strong> regarding &quot;
              {contactToDelete.subject}&quot;? This action cannot be undone.
            </span>
          ) : (
            ""
          )
        }
        confirmText="Delete Message"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
