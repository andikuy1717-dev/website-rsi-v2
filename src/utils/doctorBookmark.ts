const BOOKMARK_KEY = "doctor_favorites";

export const getDoctorBookmarks = (): Record<string, any> => {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "{}");
};

export const toggleDoctorBookmark = (doctor: any) => {
  const bookmarks = getDoctorBookmarks();

  if (bookmarks[doctor.paramedicid]) {
    delete bookmarks[doctor.paramedicid];
  } else {
    bookmarks[doctor.paramedicid] = {
      paramedicid: doctor.paramedicid,
      paramedicname: doctor.paramedicname,
      foto_base64: doctor.foto_base64,
      serviceunitnames: doctor.serviceunitnames,
    };
  }

  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));

  return bookmarks;
};

export const isDoctorBookmarked = (id: string) => {
  const bookmarks = getDoctorBookmarks();
  return !!bookmarks[id];
};