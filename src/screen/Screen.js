const API_BASE_URL =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000";

/*
=====================================================
GET SCREENS FOR THEATER
=====================================================
*/
const getHeaders = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Login token not found");
  }

  return {
    Accept: "*/*",
    Authorization: `Bearer ${token}`,
  };
};

export const getTheaterScreens = async (screenId) => {
  const response = await fetch(`${API_BASE_URL}/screens/${screenId}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch screen: ${response.status}`);
  }

  const data = await response.json();

  console.log("SCREEN BY ID DATA:", data);

  return data;
};

/*
=====================================================
NORMALIZE SCREENS
=====================================================
*/

export const normalizeScreens = (response) => {
  const screen = response?.data?.screen || response?.screen || response;

  return screen ? [screen] : [];
};
const expandRowRange = (start, end) => {
  if (!start || !end) return [];

  const startCode = start.charCodeAt(0);
  const endCode = end.charCodeAt(0);
  const rows = [];

  for (let code = startCode; code <= endCode; code += 1) {
    rows.push(String.fromCharCode(code));
  }

  return rows;
};

// 1 -> 10 becomes [1, 2, ..., 10]
const expandColumnRange = (start, end) => {
  if (start == null || end == null) return [];

  const columns = [];

  for (let n = start; n <= end; n += 1) {
    columns.push(n);
  }

  return columns;
};
const getBookedSeatKeys = (showTime) => {
  const keys = new Set();

  (showTime?.orders || []).forEach((order) => {
    (order?.seatData?.seats || []).forEach((seat) => {
      keys.add(`${seat.row}-${seat.column}`);
    });
  });

  return keys;
};

// Price for a layoutType, read from that showtime's price list
const getPriceForType = (showTime, layoutType) => {
  const match = (showTime?.price || []).find(
    (p) => p.layoutType === layoutType,
  );

  return match?.price ?? 0;
};

/*
  Parses selectedScreen.layout (a JSON string of section ranges),
  expands each section into actual seats, and marks seats booked
  for the given showTimeId as unavailable.

  Returns:
  [
    {
      type: "Platinum",
      price: 250,
      rows: [
        { name: "A", seats: [{ id, label, row, column, layoutType, available }, ...] },
        ...
      ]
    },
    ...
  ]
*/
export const getScreenLayout = (selectedScreen, showTimeId) => {
  if (!selectedScreen?.layout) return [];

  let rawSections;

  try {
    rawSections =
      typeof selectedScreen.layout === "string"
        ? JSON.parse(selectedScreen.layout)
        : selectedScreen.layout;
  } catch (err) {
    console.error("Failed to parse screen layout:", err);
    return [];
  }

  if (!Array.isArray(rawSections)) return [];

  const showTime = (selectedScreen.showTimes || []).find(
    (st) => String(st.id) === String(showTimeId),
  );

  const bookedKeys = getBookedSeatKeys(showTime);

  return rawSections.map((section) => {
    const type = section?.type || "";

    const rowLabels = expandRowRange(
      section?.layout?.rows?.[0],
      section?.layout?.rows?.[1],
    );

    const columnNumbers = expandColumnRange(
      section?.layout?.columns?.[0],
      section?.layout?.columns?.[1],
    );

    const price = getPriceForType(showTime, type);

    const rows = rowLabels.map((rowLabel) => {
      const seats = columnNumbers.map((columnNumber) => {
        const key = `${rowLabel}-${columnNumber}`;

        return {
          id: key,
          label: `${rowLabel}${columnNumber}`,
          row: rowLabel,
          column: columnNumber,
          layoutType: type,
          available: !bookedKeys.has(key),
        };
      });

      return { name: rowLabel, seats };
    });

    return { type, price, rows };
  });
};

export const getSectionName = (section) => section?.type || "";
export const getSectionPrice = (section) => section?.price ?? 0;
export const getSectionRows = (section) => section?.rows || [];
export const getSeatsFromRow = (row) => row?.seats || [];

/*
=====================================================
GET SCREEN LAYOUT
=====================================================
*/

/*
=====================================================
GET SECTION NAME
=====================================================
*/

/*
=====================================================
GET SECTION PRICE
=====================================================
*/

/*
=====================================================
GET ROWS FROM SECTION
=====================================================
*/

/*
=====================================================
CONVERT ROW INTO SEATS
=====================================================
*/

/*
=====================================================
NORMALIZE INDIVIDUAL SEAT
=====================================================
*/

export const normalizeSeat = (seat, rowIndex = 0, seatIndex = 0) => {
  /*
    STRING SEAT
  */

  if (typeof seat === "string") {
    return {
      id: seat,
      label: seat,
      number: seatIndex + 1,
      available: true,
    };
  }

  /*
    NULL / INVALID SEAT
  */

  if (!seat || typeof seat !== "object") {
    const rowName = String.fromCharCode(65 + rowIndex);

    const number = seatIndex + 1;

    return {
      id: `${rowName}-${number}`,
      label: `${rowName}${number}`,
      number,
      available: true,
    };
  }

  /*
    ROW NAME
  */

  const rowName =
    seat?.row ||
    seat?.rowName ||
    seat?.row_name ||
    String.fromCharCode(65 + rowIndex);

  /*
    SEAT NUMBER
  */

  const number =
    seat?.number ??
    seat?.seatNumber ??
    seat?.seatNo ??
    seat?.seat_number ??
    seatIndex + 1;

  /*
    AVAILABILITY
  */

  let available = true;

  if (seat?.available !== undefined) {
    available = Boolean(seat.available);
  } else if (seat?.isAvailable !== undefined) {
    available = Boolean(seat.isAvailable);
  } else if (seat?.status !== undefined) {
    available = String(seat.status).toUpperCase() !== "BOOKED";
  }

  /*
    RETURN NORMALIZED SEAT
  */

  return {
    ...seat,

    id: seat?.id || seat?._id || seat?.seatId || `${rowName}-${number}`,

    label:
      seat?.label || seat?.name || seat?.seatLabel || `${rowName}${number}`,

    number,

    available,
  };
};
