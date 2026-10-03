const BASE = "/api/v1";
const TOKEN_KEY = "scheduler_token";

const fallbackStore = new Map();

function readStored(key) {
  if (fallbackStore.has(key)) return fallbackStore.get(key);
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    fallbackStore.delete(key);
  } catch {
    fallbackStore.set(key, value);
  }
}

export function getToken() {
  return readStored(TOKEN_KEY);
}

export function setToken(token) {
  writeStored(TOKEN_KEY, token || null);
}

let _onUnauthorized = null;
export function onUnauthorized(cb) {
  _onUnauthorized = cb;
  return () => { _onUnauthorized = null; };
}

async function request(method, path, { body, token, isForm } = {}) {
  const headers = {};
  const savedToken = token || getToken();
  if (savedToken) headers["Authorization"] = `Bearer ${savedToken}`;

  let fetchBody;
  if (isForm) {
    fetchBody = new URLSearchParams(body);
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  } else if (body) {
    fetchBody = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  const resp = await fetch(`${BASE}${path}`, { method, headers, body: fetchBody });

  if (resp.status === 401 && _onUnauthorized) {
    setToken(null);
    _onUnauthorized();
  }

  if (resp.status === 204) return null;

  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    const err = new Error(data?.detail || `Request failed: ${resp.status}`);
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  register: (data) => request("POST", "/auth/register", { body: data }),
  login: async (email, password) => {
    const data = await request("POST", "/auth/login", {
      body: { username: email, password },
      isForm: true,
    });
    setToken(data.access_token);
    return data;
  },
  me: () => request("GET", "/auth/me"),
  logout: () => setToken(null),

  listMeetingTypes: () => request("GET", "/meeting-types/"),
  createMeetingType: (data) => request("POST", "/meeting-types/", { body: data }),
  updateMeetingType: (id, data) => request("PATCH", `/meeting-types/${id}`, { body: data }),
  deleteMeetingType: (id) => request("DELETE", `/meeting-types/${id}`),

  listBookings: (status) => request("GET", `/bookings/${status ? `?status_filter=${status}` : ""}`),
  createBooking: (data) => request("POST", "/bookings/", { body: data }),
  updateBooking: (id, data) => request("PATCH", `/bookings/${id}`, { body: data }),

  listAvailability: () => request("GET", "/availability/"),
  createAvailability: (data) => request("POST", "/availability/", { body: data }),
  updateAvailability: (id, data) => request("PATCH", `/availability/${id}`, { body: data }),
  deleteAvailability: (id) => request("DELETE", `/availability/${id}`),

  listTeamMembers: () => request("GET", "/team/members"),
  addTeamMember: (data) => request("POST", "/team/members", { body: data }),
  removeTeamMember: (id) => request("DELETE", `/team/members/${id}`),

  listNotifications: () => request("GET", "/notifications/"),
  markNotificationRead: (id) => request("PATCH", `/notifications/${id}/read`),

  calendarConnectGoogle: () => request("GET", "/calendar/connect/google"),
  listCalendarConnections: () => request("GET", "/calendar/connections"),
  disconnectCalendar: (id) => request("DELETE", `/calendar/connections/${id}`),

  getPublicBookingPage: (bizSlug, mtSlug) => request("GET", `/book/${bizSlug}/${mtSlug}`),
  getPublicSlots: (bizSlug, mtSlug, date) =>
    request("GET", `/book/${bizSlug}/${mtSlug}/slots?date=${date}`),
  createPublicBooking: (bizSlug, mtSlug, data) =>
    request("POST", `/book/${bizSlug}/${mtSlug}`, { body: data }),
  cancelByToken: (token) => request("POST", `/book/cancel/${token}`),
};
