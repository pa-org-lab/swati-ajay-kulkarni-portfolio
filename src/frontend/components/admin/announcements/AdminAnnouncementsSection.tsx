"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiAlertCircle,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiExternalLink,
  FiEye,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import {
  type AnnouncementItemData,
  type AnnouncementStats,
  deleteAnnouncementAction,
  getAnnouncementsAction,
  getAnnouncementsEnabledAction,
  setAnnouncementsEnabledAction,
  toggleAnnouncementPinAction,
  updateAnnouncementStatusAction,
} from "@/backend/actions/announcement.action";
import ConfirmationModal from "@/frontend/components/admin/common/ConfirmationModal";
import AnnouncementModal from "./AnnouncementModal";
import AnnouncementPreviewModal from "./AnnouncementPreviewModal";

const CATEGORY_MAP: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  "classes-workshops": {
    label: "Classes & Workshops",
    badge: "bg-amber-50 text-amber-900 border-amber-200",
    dot: "bg-amber-500",
  },
  exhibitions: {
    label: "Exhibitions",
    badge: "bg-orange-50 text-[#a8522e] border-orange-200",
    dot: "bg-[#a8522e]",
  },
  community: {
    label: "Community",
    badge: "bg-emerald-50 text-emerald-900 border-emerald-200",
    dot: "bg-emerald-500",
  },
  general: {
    label: "General",
    badge: "bg-stone-100 text-stone-700 border-stone-200",
    dot: "bg-stone-400",
  },
};

export default function AdminAnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<AnnouncementItemData[]>(
    [],
  );
  const [stats, setStats] = useState<AnnouncementStats>({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    classesWorkshops: 0,
    exhibitions: 0,
    community: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSectionEnabled, setIsSectionEnabled] = useState(true);
  const [isTogglingSection, setIsTogglingSection] = useState(false);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<AnnouncementItemData | null>(null);
  const [previewAnnouncement, setPreviewAnnouncement] =
    useState<AnnouncementItemData | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AnnouncementItemData | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAnnouncements = useCallback(
    async (showRefreshIndicator = false) => {
      if (showRefreshIndicator) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const [res, enabledStatus] = await Promise.all([
          getAnnouncementsAction({
            page: currentPage,
            limit: 20,
            type: activeCategory === "all" ? undefined : activeCategory,
            status: activeStatus === "all" ? undefined : activeStatus,
            search: searchQuery,
          }),
          getAnnouncementsEnabledAction(),
        ]);

        setIsSectionEnabled(enabledStatus);

        if (res.success && res.announcements) {
          setAnnouncements(res.announcements);
          if (res.stats) {
            setStats(res.stats);
          }
          if (res.pagination) {
            setTotalPages(res.pagination.totalPages);
          }
        } else {
          toast.error(res.error || "Failed to load announcements");
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
        toast.error("Network error while loading announcements");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentPage, activeCategory, activeStatus, searchQuery],
  );

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Handle Global Section Enable / Disable Toggle
  const handleToggleSectionEnabled = async () => {
    try {
      setIsTogglingSection(true);
      const nextState = !isSectionEnabled;
      const res = await setAnnouncementsEnabledAction(nextState);
      if (res.success) {
        setIsSectionEnabled(nextState);
        toast.success(
          nextState
            ? "Announcements section enabled on frontend"
            : "Announcements section disabled from frontend",
        );
      } else {
        toast.error(res.error || "Failed to update section visibility");
      }
    } catch {
      toast.error("Error updating section visibility");
    } finally {
      setIsTogglingSection(false);
    }
  };

  // Handle Quick Toggle Pin
  const handleTogglePin = async (item: AnnouncementItemData) => {
    try {
      const res = await toggleAnnouncementPinAction(item._id);
      if (res.success) {
        toast.success(res.message || "Pin state updated");
        setAnnouncements((prev) =>
          prev.map((a) =>
            a._id === item._id ? { ...a, isPinned: !a.isPinned } : a,
          ),
        );
      } else {
        toast.error(res.error || "Failed to update pin");
      }
    } catch {
      toast.error("Error updating pin state");
    }
  };

  // Handle Quick Status Change
  const handleStatusChange = async (
    item: AnnouncementItemData,
    newStatus: "published" | "draft" | "archived",
  ) => {
    try {
      const res = await updateAnnouncementStatusAction(item._id, newStatus);
      if (res.success) {
        toast.success(`Announcement marked as ${newStatus}`);
        setAnnouncements((prev) =>
          prev.map((a) =>
            a._id === item._id ? { ...a, status: newStatus } : a,
          ),
        );
        fetchAnnouncements();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Error updating status");
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteAnnouncementAction(itemToDelete._id);
      if (res.success) {
        toast.success(res.message || "Announcement deleted");
        setItemToDelete(null);
        fetchAnnouncements();
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch {
      toast.error("Error deleting announcement");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-7">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-[#BE6030]">
            Portfolio Content Management
          </span>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
              Announcements & Invitations
            </h1>
            <span
              className={`text-[10.5px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isSectionEnabled
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {isSectionEnabled ? "Active on Website" : "Hidden from Website"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1">
            Publish workshops, masterclasses, exhibitions, and community
            photowalk invites.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Active / Disabled Switch Button */}
          <button
            type="button"
            onClick={handleToggleSectionEnabled}
            disabled={isTogglingSection}
            title={
              isSectionEnabled
                ? "Announcements section is Active on website. Click to disable."
                : "Announcements section is Hidden from website. Click to enable."
            }
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-2xs ${
              isSectionEnabled
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                : "bg-stone-100 border-stone-300 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-transform ${
                isSectionEnabled
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse"
                  : "bg-stone-400"
              }`}
            />
            <span>
              {isSectionEnabled ? "Section: Active" : "Section: Disabled"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => fetchAnnouncements(true)}
            disabled={isRefreshing}
            title="Refresh announcements list"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 hover:text-stone-950 hover:bg-stone-50 text-xs font-medium transition-colors shadow-2xs"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#BE6030]" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingAnnouncement(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BE6030] hover:bg-[#a8522e] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Announcement</span>
          </button>
        </div>
      </div>

      {/* Visibility Alert Banner when section is disabled */}
      {!isSectionEnabled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-semibold text-amber-900">
                Announcements are currently disabled from the public website
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                The navbar link and the announcements page are hidden from
                visitors. You can still manage and draft announcements here.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleSectionEnabled}
            disabled={isTogglingSection}
            className="px-4 py-2 rounded-xl bg-[#BE6030] hover:bg-[#a8522e] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            Enable Section
          </button>
        </div>
      )}

      {/* 2. Key Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Announcements */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider">
              Total Announcements
            </span>
            <FiBell className="text-stone-400 w-4 h-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
              {stats.total}
            </span>
            <span className="text-[11px] text-stone-400 font-sans">
              ({stats.published} active)
            </span>
          </div>
        </div>

        {/* Classes & Workshops */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider">
              Classes & Workshops
            </span>
            <FiClock className="text-amber-500 w-4 h-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
              {stats.classesWorkshops}
            </span>
            <span className="text-[11px] text-amber-700 font-sans">
              interactive sessions
            </span>
          </div>
        </div>

        {/* Exhibitions */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider">
              Exhibitions
            </span>
            <FiCheckCircle className="text-[#a8522e] w-4 h-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
              {stats.exhibitions}
            </span>
            <span className="text-[11px] text-[#a8522e] font-sans">
              shows & galleries
            </span>
          </div>
        </div>

        {/* Community */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider">
              Community Invites
            </span>
            <FiUsers className="text-emerald-500 w-4 h-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
              {stats.community}
            </span>
            <span className="text-[11px] text-emerald-700 font-sans">
              photowalks & talks
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, location, content..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#BE6030]/20 focus:border-[#BE6030]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-medium self-start md:self-auto">
            {(["all", "published", "draft", "archived"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setActiveStatus(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  activeStatus === st
                    ? "bg-white text-stone-900 shadow-2xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-stone-100">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
            Category:
          </span>
          {[
            { id: "all", label: "All Categories" },
            { id: "classes-workshops", label: "Classes & Workshops" },
            { id: "exhibitions", label: "Exhibitions" },
            { id: "community", label: "Community Invitations" },
            { id: "general", label: "General Updates" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-[#2b1f18] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Announcements List */}
      <div className="rounded-2xl bg-white border border-stone-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-stone-400 space-y-3">
            <FiRefreshCw className="w-8 h-8 animate-spin text-[#BE6030]" />
            <p className="text-sm font-sans">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-stone-800">
                No announcements found
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-1">
                {searchQuery ||
                activeCategory !== "all" ||
                activeStatus !== "all"
                  ? "Try adjusting your search criteria or clearing filters."
                  : "Start sharing workshops, masterclasses, and exhibitions with your audience."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingAnnouncement(null);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#BE6030] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#a8522e] transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Announcement</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {announcements.map((item) => {
              const catMeta = CATEGORY_MAP[item.type] || CATEGORY_MAP.general;

              const formattedDate = item.eventDate
                ? new Date(item.eventDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : null;

              return (
                <div
                  key={item._id}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-stone-50/70 ${
                    item.isPinned ? "bg-amber-50/20" : ""
                  }`}
                >
                  {/* Left: Star + Details */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Pin Star button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePin(item)}
                      title={
                        item.isPinned ? "Unpin announcement" : "Pin to top"
                      }
                      className={`p-1.5 rounded-lg transition-colors mt-0.5 ${
                        item.isPinned
                          ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                          : "text-stone-300 hover:text-amber-500 hover:bg-stone-100"
                      }`}
                    >
                      <FiStar
                        className={`w-4 h-4 ${item.isPinned ? "fill-amber-400" : ""}`}
                      />
                    </button>

                    {/* Metadata & Title */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-sans font-semibold border ${catMeta.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${catMeta.dot}`}
                          />
                          <span>{catMeta.label}</span>
                        </span>

                        {/* Status selector */}
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              item,
                              e.target.value as
                                | "published"
                                | "draft"
                                | "archived",
                            )
                          }
                          aria-label="Change status"
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border focus:outline-none cursor-pointer ${
                            item.status === "published"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : item.status === "draft"
                                ? "bg-stone-100 text-stone-700 border-stone-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>

                        {/* Event date badge if present */}
                        {formattedDate && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-sans">
                            <FiCalendar className="w-3 h-3 text-[#BE6030]" />
                            <span>{formattedDate}</span>
                          </span>
                        )}

                        {/* Location if present */}
                        {item.location && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-sans truncate max-w-[200px]">
                            <FiMapPin className="w-3 h-3 text-[#BE6030]" />
                            <span>{item.location}</span>
                          </span>
                        )}
                      </div>

                      {/* Announcement Title */}
                      <button
                        type="button"
                        onClick={() => setPreviewAnnouncement(item)}
                        className="text-left font-serif text-base sm:text-lg text-stone-900 font-medium hover:text-[#BE6030] cursor-pointer transition-colors block"
                      >
                        {item.title}
                      </button>

                      {/* Summary or excerpt */}
                      {item.summary && (
                        <p className="text-xs text-stone-500 font-sans line-clamp-1">
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                    {/* External Link if exists */}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open external action link"
                        className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewAnnouncement(item)}
                      title="Preview how it looks on website"
                      className="p-2 rounded-xl text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAnnouncement(item);
                        setIsCreateModalOpen(true);
                      }}
                      title="Edit announcement"
                      className="p-2 rounded-xl text-stone-500 hover:text-[#BE6030] hover:bg-[#BE6030]/10 transition-colors"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      title="Delete announcement"
                      className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-stone-100 bg-[#FAF7F5] flex items-center justify-between text-xs text-stone-600">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Create / Edit Modal */}
      <AnnouncementModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingAnnouncement(null);
        }}
        announcement={editingAnnouncement}
        onSuccess={() => fetchAnnouncements()}
      />

      {/* 6. Preview Modal */}
      <AnnouncementPreviewModal
        isOpen={Boolean(previewAnnouncement)}
        onClose={() => setPreviewAnnouncement(null)}
        announcement={previewAnnouncement}
      />

      {/* 7. Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Announcement"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong>&quot;{itemToDelete?.title}&quot;</strong>? This action
            cannot be undone.
          </>
        }
        confirmText="Delete Announcement"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
